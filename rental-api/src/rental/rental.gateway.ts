import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RentalEvents } from "src/types/gateway";
import { Rental } from "./entities/rental.entity";
import { QueueEntry } from "./entities/queue-entry.entity";
import { JwtService } from "@nestjs/jwt";
import { GamesGateway } from "src/game/game.gateway";
import { Repository } from "typeorm";
import { Game } from "src/game/entities/game.entity";
import { User } from "src/user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRentalDto } from "./dto/create-rental.dto";
import { corsOption } from "src/cors";
import { appEnv } from "src/config/env";
import { JwtPayload } from "src/types/jwt-payload";

@WebSocketGateway({ namespace: "rentals", cors: corsOption })
export class RentalGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server<any, RentalEvents>;

  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,

    @InjectRepository(QueueEntry)
    private readonly queueRepo: Repository<QueueEntry>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private gamesGateway: GamesGateway,

    private jwtService: JwtService,
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const token =
      (socket.handshake.auth?.token as string | undefined) ??
      socket.handshake.headers?.authorization;

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: appEnv.jwtSecret,
      });
    } catch {
      socket.disconnect();
    }
  }

  @SubscribeMessage("add")
  async addRental(
    @MessageBody() createRentalDto: CreateRentalDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const game = await this.gameRepo.findOneBy({
        id: createRentalDto.game.id,
      });

      if (!game) {
        client.emit("addStatus", {
          status: 404,
          message: "Game not found",
        });
        return;
      }

      if (game.quantity <= 0) {
        // Game unavailable - inform client they can join queue
        client.emit("addStatus", {
          status: 409,
          message: "Game unavailable - can join queue",
          canJoinQueue: true,
          gameId: game.id,
        });
        return;
      }

      await this.gameRepo.update(game.id, { quantity: game.quantity - 1 });
      const updatedGame = { ...game, quantity: game.quantity - 1 };
      const rental = await this.rentalRepo.save({
        ...createRentalDto,
        game: updatedGame,
      });

      this.gamesGateway.sendGameChanges(updatedGame);
      this.sendRentalCreated(rental);
      client.emit("addStatus", { status: 200, message: "ok" });
    } catch (e) {
      client.emit("addStatus", e);
    }
  }

  @SubscribeMessage("getQueueStatus")
  async getQueueStatus(
    @MessageBody("gameId") gameId: number,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token =
        (client.handshake.auth?.token as string | undefined) ??
        client.handshake.headers?.authorization;

      if (!token) {
        client.emit("queueStatus", { status: 401, message: "Unauthorized" });
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: appEnv.jwtSecret,
      });

      const entry = await this.queueRepo.findOne({
        where: { user: { id: payload.id }, game: { id: gameId } },
        relations: ["user", "game"],
      });

      if (entry) {
        const position = await this.getQueuePosition(payload.id, gameId);
        client.emit("queueStatus", {
          status: 200,
          inQueue: true,
          position,
          gameId,
        });
      } else {
        client.emit("queueStatus", {
          status: 200,
          inQueue: false,
          gameId,
        });
      }
    } catch (e) {
      client.emit("queueStatus", {
        status: 500,
        message: "Failed to get queue status",
        error: e,
      });
    }
  }

  @SubscribeMessage("joinQueue")
  async joinQueue(
    @MessageBody("gameId") gameId: number,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Get user from JWT token in socket auth
      const token =
        (client.handshake.auth?.token as string | undefined) ??
        client.handshake.headers?.authorization;

      if (!token) {
        client.emit("joinQueueStatus", {
          status: 401,
          message: "Unauthorized",
        });
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: appEnv.jwtSecret,
      });

      const user = await this.userRepo.findOneBy({ id: payload.id });
      if (!user) {
        client.emit("joinQueueStatus", {
          status: 404,
          message: "User not found",
        });
        return;
      }

      const game = await this.gameRepo.findOneBy({ id: gameId });
      if (!game) {
        client.emit("joinQueueStatus", {
          status: 404,
          message: "Game not found",
        });
        return;
      }

      // Check if already in queue
      const existing = await this.queueRepo.findOneBy({
        user: { id: user.id },
        game: { id: gameId },
      });

      if (existing) {
        client.emit("joinQueueStatus", {
          status: 409,
          message: "Already in queue for this game",
          position: await this.getQueuePosition(user.id, gameId),
          gameId,
        });
        return;
      }

      // Add to queue
      const queueEntry = this.queueRepo.create({ user, game });
      await this.queueRepo.save(queueEntry);

      // Get position
      const position = await this.getQueuePosition(user.id, gameId);

      client.emit("joinQueueStatus", {
        status: 200,
        message: "Joined queue",
        position,
        gameId,
      });

      // Notify client of queue position
      client.emit("queueJoined", { position, gameId });
    } catch (e) {
      client.emit("joinQueueStatus", {
        status: 500,
        message: "Failed to join queue",
        error: e,
      });
    }
  }

  @SubscribeMessage("leaveQueue")
  async leaveQueue(
    @MessageBody("gameId") gameId: number,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token =
        (client.handshake.auth?.token as string | undefined) ??
        client.handshake.headers?.authorization;

      if (!token) {
        client.emit("leaveQueueStatus", {
          status: 401,
          message: "Unauthorized",
        });
        return;
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: appEnv.jwtSecret,
      });

      await this.queueRepo.delete({ user: { id: payload.id }, game: { id: gameId } });

      client.emit("leaveQueueStatus", {
        status: 200,
        message: "Left queue",
      });
    } catch (e) {
      client.emit("leaveQueueStatus", {
        status: 500,
        message: "Failed to leave queue",
        error: e,
      });
    }
  }

  @SubscribeMessage("return")
  async returnRental(
    @MessageBody("id") id: number,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const rental = await this.rentalRepo.findOneBy({ id });

      if (
        !rental ||
        rental.returnedAt ||
        rental.game.quantity >= rental.game.amount
      ) {
        client.emit("returnStatus", {
          status: 400,
          message: "Rental cannot be returned",
        });
        return;
      }

      const game = { ...rental.game, quantity: rental.game.quantity + 1 };
      const returnedAt = new Date();

      await this.gameRepo.update(game.id, { quantity: game.quantity });
      await this.rentalRepo.update(rental.id, { returnedAt });

      this.gamesGateway.sendGameChanges(game);
      this.sendRentalChanges({ ...rental, returnedAt });

      // Check if there are users in queue for this game
      const nextInQueue = await this.queueRepo.findOne({
        where: { game: { id: game.id } },
        order: { createdAt: "ASC" },
        relations: ["user", "game"],
      });

      if (nextInQueue) {
        // Auto-rent to next user in queue
        await this.gameRepo.update(game.id, { quantity: game.quantity - 1 });
        const updatedGame = { ...game, quantity: game.quantity - 1 };

        const autoRental = await this.rentalRepo.save({
          index: nextInQueue.user.email, // Use user's email as index for auto-rentals
          rentedAt: new Date(),
          game: updatedGame,
          user: nextInQueue.user,
        });

        // Remove from queue
        await this.queueRepo.delete({ id: nextInQueue.id });

        // Notify the auto-rented user
        this.server.to(nextInQueue.user.id.toString()).emit("autoRented", autoRental);

        // Broadcast rental created
        this.sendRentalCreated(autoRental);

        // Update game quantity again
        this.gamesGateway.sendGameChanges(updatedGame);

        // Notify next user in queue of their new position
        const nextNext = await this.queueRepo.findOne({
          where: { game: { id: game.id } },
          order: { createdAt: "ASC" },
          relations: ["user"],
        });

        if (nextNext) {
          this.server.to(nextNext.user.id.toString()).emit("queueUpdated", {
            position: 1,
            gameId: game.id,
          });
        }
      }

      client.emit("returnStatus", { status: 200, message: "ok" });
    } catch (e) {
      client.emit("returnStatus", e);
    }
  }

  @SubscribeMessage("delete")
  async removeRental(
    @MessageBody("id") id: number,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.rentalRepo.delete({ id });
      this.sendRentalDeleted(id);
      client.emit("deleteStatus", { status: 200, message: "ok" });
    } catch (e) {
      client.emit("deleteStatus", e);
    }
  }

  sendRentalCreated(rental: Rental) {
    this.server.emit("rentalCreated", rental);
  }

  sendRentalChanges(rental: Rental) {
    this.server.emit("rentalStatusChanged", rental);
  }

  sendRentalDeleted(id: number) {
    this.server.emit("rentalDeleted", id);
  }

  private async getQueuePosition(userId: number, gameId: number): Promise<number> {
    const entries = await this.queueRepo.find({
      where: { game: { id: gameId } },
      order: { createdAt: "ASC" },
      relations: ["user"],
    });

    const index = entries.findIndex(e => e.user.id === userId);
    return index >= 0 ? index + 1 : 0;
  }
}

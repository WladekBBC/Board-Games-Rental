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
import { JwtService } from "@nestjs/jwt";
import { GamesGateway } from "src/game/game.gateway";
import { Repository } from "typeorm";
import { Game } from "src/game/entities/game.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRentalDto } from "./dto/create-rental.dto";
import { corsOption } from "src/cors";
import { appEnv } from "src/config/env";
import { JwtPayload } from "src/types/jwt-payload";

@WebSocketGateway({ namespace: "rentals", cors: corsOption })
export class RentalGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server<any, RentalEvents>;

  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

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

      if (!game || game.quantity <= 0) {
        client.emit("addStatus", {
          status: 400,
          message: "Game unavailable",
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
}

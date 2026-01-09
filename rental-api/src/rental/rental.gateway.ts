import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RentalEvents } from "src/types/gateway";
import { Rental } from "./entities/rental.entity";
import { JwtService } from "@nestjs/jwt";
import { GamesGateway } from "src/game/game.gateway";
import { Repository } from "typeorm";
import { Game } from "src/game/entities/game.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRentalDto } from "./dto/create-rental.dto";

@WebSocketGateway({namespace: "rentals"})
export class RentalGateway implements OnGatewayConnection{
  @WebSocketServer()
  server: Server<any, RentalEvents>;

  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

    private gamesGateway: GamesGateway,
    
    private jwtService: JwtService
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket){
    const token: string|undefined = socket.handshake.headers?.authorization || socket.handshake.auth.token;

    if (!token) {
      socket.disconnect();
      return;
    }

    await this.jwtService.verifyAsync(token, {secret: `${process.env.JWT_SEC}`})
      .catch(() => {socket.disconnect()});
  }

  @SubscribeMessage('add')
  async addRental(@MessageBody() createRentalDto: CreateRentalDto, @ConnectedSocket() client: Socket) {
    try{
      const game = await this.gameRepo.findOneBy({id: createRentalDto.game.id});

      if(game && game.quantity > 0){
        await this.gameRepo.update(game.id, {quantity: --game.quantity});
        const rental = await this.rentalRepo.save({...createRentalDto, game: game});
  
        this.gamesGateway.sendGameChanges(game)
        this.sendRentalCreated(rental);
        console.log("dziala?")
        client.emit("addStatus", {status: 200, message: "ok"})
      }
    }catch(e){
      client.emit("addStatus", e)
    }
  }

  @SubscribeMessage('return')
  async returnRental(@MessageBody('id') id: number, @ConnectedSocket() client: Socket){
    console.log(id)
    try{
      const rental = await this.rentalRepo.findOneBy({id: id});
  
      if(rental && !rental.returnedAt && rental.game.quantity != rental.game.amount){
        const game = {...rental.game, quantity: rental.game.quantity+1}

        const returnedAt = new Date(Date.now())

        this.gameRepo.update(game.id, {quantity: game.quantity})
        this.rentalRepo.update(rental.id, {returnedAt})

        this.gamesGateway.sendGameChanges(game)
        this.sendRentalChanges({...rental, returnedAt})
        client.emit("returnStatus", {status: 200, message: "ok"})
      }
    }catch(e){
      client.emit("returnStatus", e)
    }
  }

  @SubscribeMessage('delete')
  async removeRental(@MessageBody('id') id: number, @ConnectedSocket() client: Socket) {
    try{
      await this.rentalRepo.delete({id})
      this.sendRentalDeleted(id)
      client.emit("deleteStatus", {status: 200, message: "ok"})
    }catch(e){
      client.emit("deleteStatus", e)
    }
  }

  sendRentalCreated(rental: Rental){
    this.server.emit("rentalCreated", rental)
  }

  sendRentalChanges(rental: Rental){
    this.server.emit("rentalStatusChanged", rental)
  }

  sendRentalDeleted(id: number){
    this.server.emit("rentalDeleted", id)
  }
}
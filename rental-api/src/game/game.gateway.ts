import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { GamesEvents } from "src/types/gateway";
import { Game } from "src/game/entities/game.entity";
import { corsOption } from "src/cors";

@WebSocketGateway({namespace: "games", cors: corsOption})
export class GamesGateway{
  @WebSocketServer()
  server: Server<any, GamesEvents>;

  sendGameChanges(game: Game){
    this.server.emit("gameQuantityChange", game)
  }
}
import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { Game } from "./entities/game.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GamesGateway } from "./game.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService, GamesGateway],
  exports: [GamesGateway],
})
export class GameModule {}

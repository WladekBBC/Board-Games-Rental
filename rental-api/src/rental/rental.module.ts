import { Module } from "@nestjs/common";
import { RentalService } from "./rental.service";
import { RentalController } from "./rental.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rental } from "./entities/rental.entity";
import { QueueEntry } from "./entities/queue-entry.entity";
import { Game } from "src/game/entities/game.entity";
import { RentalGateway } from "./rental.gateway";
import { GameModule } from "src/game/game.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Rental, QueueEntry, Game]), GameModule, UserModule],
  controllers: [RentalController],
  providers: [RentalService, RentalGateway],
})
export class RentalModule {}

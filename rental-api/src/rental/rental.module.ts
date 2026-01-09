import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { Game } from 'src/game/entities/game.entity';
import { RentalGateway } from './rental.gateway';
import { GamesGateway } from 'src/game/game.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental, Game]),
  ],
  controllers: [RentalController],
  providers: [RentalService, RentalGateway, GamesGateway],
})
export class RentalModule {}

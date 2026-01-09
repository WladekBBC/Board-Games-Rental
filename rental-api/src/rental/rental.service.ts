import { BadRequestException, Injectable } from '@nestjs/common';
import { Rental } from './entities/rental.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/game/entities/game.entity';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ){}

  findAll() {
    return this.rentalRepo.find();
  }

  async findByGame(gameId: number){
    const game = await this.gameRepo.findOneBy({id: gameId})
    if(game)
      return this.rentalRepo.findBy({ game:game })
    throw new BadRequestException
  }

  findOne(id: number) {
    return this.rentalRepo.findOneBy({id});
  }
}

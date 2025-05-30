import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
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

  async create(createRentalDto: CreateRentalDto) {
    const game = await this.gameRepo.findOneBy({id: createRentalDto.game.id});
    if(game && game?.quantity > 0){
      this.gameRepo.update(game.id, {quantity: game.quantity-1});
      return this.rentalRepo.save(createRentalDto);
    }
    throw new NotAcceptableException;
  }

  findAll() {
    return this.rentalRepo.find();
  }

  findOne(id: number) {
    return this.rentalRepo.findOneBy({id});
  }

  remove(id: number) {
    return this.rentalRepo.delete({id});
  }

  async return(id: number) {
    const rental = await this.findOne(id)
    if(rental && !rental.returnedAt && rental.game.quantity != rental.game.amount){
      this.gameRepo.update(rental.game.id, {quantity: rental.game.quantity+1});
      return this.rentalRepo.update(id, {returnedAt: new Date(Date.now())});
    }
    throw new NotAcceptableException;
  }
}

import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
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
    if(game && game.quantity > 0){
      return this.gameRepo.save({...game, quantity: game.quantity-1}).then((res)=>(this.rentalRepo.save({...createRentalDto, game: res})));
    }
    throw new NotAcceptableException;
  }

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

  remove(id: number) {
    return this.rentalRepo.delete({id});
  }

  async return(id: number) {
    const rental = await this.findOne(id)
    if(rental && !rental.returnedAt && rental.game.quantity != rental.game.amount){
      await this.gameRepo.update(rental.game.id, {quantity: rental.game.quantity+1});
      return this.rentalRepo.update(id, {returnedAt: new Date(Date.now())});
    }
    throw new NotAcceptableException;
  }
}

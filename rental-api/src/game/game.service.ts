import { Injectable, NotAcceptableException, Logger } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeQuantity } from './dto/change-quantity.dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(    
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ){}
  create(createGameDto: CreateGameDto) {
    return this.gameRepo.save(createGameDto);
  }

  findAll() {
    return this.gameRepo.find();
  }

  findOne(id: number) {
    return this.gameRepo.findOneBy({id});
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepo.update(id, updateGameDto);
  }

  async changeQuantity(changeQuantityDto: ChangeQuantity) {
    const game = await this.gameRepo.findOneBy({id: changeQuantityDto.id});    
    if (!game) {
      throw new NotAcceptableException('Game not found');
    }
    if (changeQuantityDto.quantity < 0 || changeQuantityDto.quantity > game.amount) {
      throw new NotAcceptableException('Invalid quantity');
    }
    const result = await this.gameRepo.update(changeQuantityDto.id, {quantity: changeQuantityDto.quantity});
    return result;
  }

  remove(id: number) {
    return this.gameRepo.delete(id);
  }
}

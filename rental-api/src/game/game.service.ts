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
    this.logger.debug(`Received change quantity request: ${JSON.stringify(changeQuantityDto)}`);
    
    const game = await this.gameRepo.findOneBy({id: changeQuantityDto.id});
    this.logger.debug(`Found game: ${JSON.stringify(game)}`);
    
    if (!game) {
      this.logger.error(`Game not found with id: ${changeQuantityDto.id}`);
      throw new NotAcceptableException('Game not found');
    }
    
    if (changeQuantityDto.quantity < 0 || changeQuantityDto.quantity > game.amount) {
      this.logger.error(`Invalid quantity: ${changeQuantityDto.quantity}. Game amount: ${game.amount}`);
      throw new NotAcceptableException('Invalid quantity');
    }
    
    const result = await this.gameRepo.update(changeQuantityDto.id, {quantity: changeQuantityDto.quantity});
    this.logger.debug(`Update result: ${JSON.stringify(result)}`);
    return result;
  }

  remove(id: number) {
    return this.gameRepo.delete(id);
  }
}

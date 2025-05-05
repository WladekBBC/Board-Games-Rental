import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameService {
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

  remove(id: number) {
    return this.gameRepo.delete(id);
  }
}

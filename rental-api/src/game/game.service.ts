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
    return 'This action adds a new game';
  }

  findAll() {
    return this.gameRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}

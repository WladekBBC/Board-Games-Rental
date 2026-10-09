import { Injectable, BadRequestException, ConflictException } from "@nestjs/common";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError } from "typeorm";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ) {}
  create(createGameDto: CreateGameDto) {
    return this.gameRepo.insert(createGameDto).catch((error: QueryFailedError) => {
      const driverError = (error as any).driverError;
      if (driverError?.code === 'ER_DUP_ENTRY' || driverError?.code === '23505') {
        throw new ConflictException("Game already exists!");
      }
      throw new BadRequestException();
    });
  }

  findAll() {
    return this.gameRepo.find();
  }

  findOne(id: number) {
    return this.gameRepo.findOneBy({ id });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepo.update(id, updateGameDto).catch((error: QueryFailedError) => {
      const driverError = (error as any).driverError;
      if (driverError?.code === 'ER_DUP_ENTRY' || driverError?.code === '23505') {
        throw new ConflictException("Game already exists!");
      }
      throw new BadRequestException();
    });
  }

  remove(id: number) {
    return this.gameRepo.delete(id);
  }
}

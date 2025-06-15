import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "src/game/entities/game.entity";
import { Rental } from "src/rental/entities/rental.entity";
import { Repository } from "typeorm";




@Injectable()

export class OrderService
{
    constructor(
        @InjectRepository(Rental)
        private readonly rentalRepo: Repository<Rental>,
    
        @InjectRepository(Game)
        private readonly gameRepo: Repository<Game>,
      ){}
}

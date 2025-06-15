import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "src/game/entities/game.entity";
import { Rental } from "src/rental/entities/rental.entity";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";


@Injectable()
export class OrderService{
  constructor(
      @InjectRepository(Order)
      private readonly orderRepo: Repository<Order>,
  
      @InjectRepository(Game)
      private readonly gameRepo: Repository<Game>,
  ){}

  findAll() {
    return this.orderRepo.find();
  }

  findOne(id: number) {
    return this.orderRepo.findOneBy({id});
  }

  async create(createOrderDto: CreateOrderDto){
    return this.orderRepo.save(createOrderDto)
  }

  remove(id: number) {
    return this.orderRepo.delete({id})
  }

  async findByGame(gameId: number){
    const game = await this.gameRepo.findOneBy({id: gameId})
    if(game)
      return this.orderRepo.findBy({ game:game })
    throw new BadRequestException
  }
}

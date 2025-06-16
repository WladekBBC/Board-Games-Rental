import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "src/game/entities/game.entity";
import { Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "src/user/entities/user.entity";
import { Status } from "src/enums/status.enum";
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as QRCode from 'qrcode'


@Injectable()
export class OrderService{
  constructor(
    @InjectQueue('order') 
    private readonly orderQueue: Queue, 

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ){}

  findAll() {
    return this.orderRepo.find();
  }

  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id }, relations: ['user', 'game'] });
  }
  
  async create(createOrderDto: CreateOrderDto): Promise<Order>{
    const game = await this.gameRepo.findOneBy({id: createOrderDto.game.id})
    if(!game){
      throw new NotFoundException;
    }
    const user = await this.userRepo.findOneBy({id: createOrderDto.user.id})
    if(!user){
      throw new NotFoundException;
    }
    const newOrder = this.orderRepo.create({ ...createOrderDto, game, user, status: Status.W });
    let savedOrder = newOrder;

    const verificationURL = `${process.env.API_URL}orders/verify/${savedOrder.qrIdentifier}`;
    const verificationURLBase64 = await QRCode.toDataURL(verificationURL);

    savedOrder.qrCodeImage = verificationURLBase64;
    savedOrder = await this.orderRepo.save(savedOrder);
    return savedOrder;
  }

  async accept(id: number){
    const order =  await this.findOneOrThrow(id);
    if(order?.status !== Status.W){
      throw new BadRequestException;
    }
    await this.orderRepo.update(id, {status: Status.A});
    return this.findOneOrThrow(id);
  }

  async cancel(id: number): Promise<Order> {
    const order = await this.findOneOrThrow(id);
    if((order.status !== Status.W) && order.status !== Status.A){
      throw new BadRequestException;
    }
    await this.orderRepo.update(id, {status: Status.C});
    return this.findOneOrThrow(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepo.delete({id});
    if(result.affected === 0){
      throw new NotFoundException;
    }
  }

  async expire(id: number): Promise<Order | null>{
    const order = await this.findOneOrThrow(id);
    if (order && order.status === Status.W) {
      await this.orderRepo.update(id, { status: Status.E }); 
      return this.findOneOrThrow(id);
    }
    return null
  }

  async findByGame(gameId: number): Promise<Order[]> {
    const gameExists = await this.gameRepo.findOneBy({ id: gameId });
    if (!gameExists) {
      throw new NotFoundException;
    }
    return this.orderRepo.find({ 
      where: { game: { id: gameId } } });
  }

  async findOrderByQR(qrCodeImage: string): Promise<Order[]>{
    const order = await this.orderRepo.findOneBy({qrCodeImage: qrCodeImage});
    if(!order){
      throw new NotFoundException;
    }
    return this.orderRepo.find({where : {qrCodeImage: qrCodeImage}})
  }
  async findByUser(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException();
    }
    return this.orderRepo.find({
      where: {
        user: { id: userId } 
      },
      relations: ['game'], 
    });
  }

  private async findOneOrThrow(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'game'],
    });
    if (!order) {
      throw new NotFoundException;
    }
    return order;
  }
}


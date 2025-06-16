import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { LessThan, Repository } from "typeorm";
import { OrderService } from "./order.service";
import { Cron, CronExpression } from '@nestjs/schedule';
import { Status } from "src/enums/status.enum";


@Injectable()
export class OrderExpirationService{
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        private readonly orderService: OrderService, 
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron(): Promise<void> {

        const EXPIRATION_HOURS = 24;
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() - EXPIRATION_HOURS);
        const ordersToExpire = await this.orderRepo.find({where: {status: Status.W, createdAt: LessThan(expirationDate)}})
        if (ordersToExpire.length === 0) {
            return;
        }

        for(const order of ordersToExpire){
            await this.orderService.expire(order.id)
        }
    }
}
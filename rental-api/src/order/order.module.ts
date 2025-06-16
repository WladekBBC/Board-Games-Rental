import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "src/game/entities/game.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderExpirationService } from "./order-expiration.service";
import { Order } from "./entities/order.entity";
import { User } from "src/user/entities/user.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Game, User])
      ],
      controllers: [OrderController],
      providers: [OrderService, OrderExpirationService],
})
export class OrderModule{};
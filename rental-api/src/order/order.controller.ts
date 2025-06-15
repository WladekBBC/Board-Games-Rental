import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";


@Controller('rental')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    
    @Get('/orders')
    getAllOrders(){
        return this.orderService.findAll();
    }

    @Get('/orders/:id')
    getOrdersByID(@Param('id') id: number){
        return this.orderService.findOne(id);
    }

    @Get('/history/:id')
    findHistory(@Param('id') gameId: number) {
    return this.orderService.findByGame(gameId);
    }
    
    @Post('/add')
    create(@Body() createOrderDto: CreateOrderDto){
        return this.orderService.create(createOrderDto)
    }

}
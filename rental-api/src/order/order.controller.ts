import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Perms } from "src/enums/permissions.enum";
import { Permission } from "src/decorators/permissions.decorator";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    
    @Post('/add')
    create(@Body() createOrderDto: CreateOrderDto){
        return this.orderService.create(createOrderDto)
    }
    
    @Permission([Perms.A,Perms.R])
    @Get('/orders')
    getAllOrders(){
        return this.orderService.findAll();
    }

    @Get(':id')
    getOrdersByID(@Param('id') id: number){
        return this.orderService.findOne(id);
    }

    @Get('/history/game/:id')
    findHistoryGame(@Param('id') gameId: number) {
        return this.orderService.findByGame(gameId);
    }

    @Permission([Perms.A,Perms.R])
    @Get('/history/user/:id')
    findHistoryUser(@Param('id') userID: number) {
        return this.orderService.findByUser(userID);
    }

    @Permission([Perms.A,Perms.R])
    @Get('/verify/:qrIdentifier')
    async findOrderByQR(@Param('qrIdentifier') qrIdentifier: string){
        return this.orderService.findOrderByQRID(qrIdentifier)
    }
    
    @Permission([Perms.A,Perms.R])
    @Patch('/accept/:id')
    accept(@Param('id') id: number){
        return this.orderService.accept(id)
    }

    @Permission([Perms.A,Perms.R])
    @Patch('/cancel/:id')
    cancel(@Param('id') id: number){
        return this.orderService.cancel(id)
    }

    @Permission([Perms.A])
    @Delete('/delete/:id')
    delete(@Param('id') id: number){
        return this.orderService.remove(id)
    }
}
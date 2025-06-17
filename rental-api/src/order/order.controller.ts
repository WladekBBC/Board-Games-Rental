import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Perms } from "src/enums/permissions.enum";
import { Permission } from "src/decorators/permissions.decorator";
import { AuthGuard } from "src/guards/auth.guard";

// @UseGuards(AuthGuard)
// @Permission([Perms.A, Perms.R])
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    
    @Post('/add')
    create(@Body() createOrderDto: CreateOrderDto){
        return this.orderService.create(createOrderDto)
    }

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

    @Get('/history/user/:id')
    findHistoryUser(@Param('id') userID: number) {
        return this.orderService.findByUser(userID);
    }

    @Get('/verify/:qrIdentifier')
    async findOrderByQR(@Param('qrIdentifier') qrIdentifier: string){
        return this.orderService.findOrderByQRID(qrIdentifier)
    }
    
    @Patch('/accept/:id')
    accept(@Param('id') id: number){
        return this.orderService.accept(id)
    }

    @Patch('/cancel/:id')
    cancel(@Param('id') id: number){
        return this.orderService.cancel(id)
    }

    @Delete('/delete/:id')
    delete(@Param('id') id: number){
        return this.orderService.remove(id)
    }
}
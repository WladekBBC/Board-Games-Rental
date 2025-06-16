import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Perms } from "src/enums/permissions.enum";
import { Permission } from "src/decorators/permissions.decorator";
import { AuthGuard } from "src/guards/auth.guard";

// @UseGuards(AuthGuard)
// @Permission([Perms.A, Perms.R])
@Controller('rental')
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

    @Get('/orders/:id')
    getOrdersByID(@Param('id') id: number){
        return this.orderService.findOne(id);
    }

    @Get('/history/:id')
    findHistoryGame(@Param('id') gameId: number) {
        return this.orderService.findByGame(gameId);
    }

    @Get('/history/:id')
    findHistoryUser(@Param('id') userID: number) {
        return this.orderService.findByUser(userID);
    }

    @Get('/verify/:qrCodeImageURL')
    async findOrderByQR(@Param('qrCodeImage') qrCodeImage: string){
        return this.orderService.findOrderByQR(qrCodeImage)
    }
    
    @Patch('/accept')
    accept(@Param('id') id: number){
        return this.orderService.accept(id)
    }

    @Patch('/cancel')
    cancel(@Param('id') id: number){
        return this.orderService.cancel(id)
    }

    @Delete('/delete/:id')
    delete(@Param('id') id: number){
        return this.orderService.remove(id)
    }
}
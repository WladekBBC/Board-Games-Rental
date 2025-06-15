import { Controller, Get } from "@nestjs/common";


@Controller()
export class OrderController {
    
    @Get()
    getAllOrders (){
        return this.getAllOrders.findAll()
    }
    
}
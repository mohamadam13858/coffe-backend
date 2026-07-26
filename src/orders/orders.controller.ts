import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService){}
 

    @Post()
    createOrder(@Body() createOrderDto: CreateOrderDto ,@GetUser() user ){
           this.ordersService.createOrder(createOrderDto , user)
    }
}

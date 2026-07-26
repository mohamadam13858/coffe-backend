import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService){}
 

    @Post()
    createOrder(@Body() createOrderDto: CreateOrderDto ,@GetUser() user: User ){
          return this.ordersService.createOrder(createOrderDto , user)
    }


    @Patch(':id/status')
    @Roles('admin')
    updateStatus(@Param('id') id: string ,@Body() updateOrderStatusDto: UpdateOrderStatusDto){
       return this.ordersService.updateStatus(id, updateOrderStatusDto)
    }
}

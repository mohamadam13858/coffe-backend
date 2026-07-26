import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/menu/entities/product.entity';
import { Table } from 'src/table/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order , OrderItem , Product , Table ])]  , 
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { InventoryModule } from './inventory/inventory.module';
import { TableModule } from './table/table.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { StaffModule } from './staff/staff.module';
import { CustomersModule } from './customers/customers.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [ProductsModule, UsersModule, AuthModule, MenuModule, InventoryModule, TableModule, OrdersModule, OrderItemsModule, ReservationsModule, PaymentsModule, StaffModule, CustomersModule, ReportsModule, SettingsModule, RolesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

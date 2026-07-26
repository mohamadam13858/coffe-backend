import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, In, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/menu/entities/product.entity';
import { Table } from 'src/table/entities/table.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/user.entity';
import { TableStatus } from 'src/table/table-status.enum';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,

        @InjectRepository(Table)
        private tableRepository: Repository<Table>,

        private dataSource: DataSource

    ) { }

    async createOrder(createOrderDto: CreateOrderDto, user: User) {
        const { tableId, notes, items } = createOrderDto

        return await this.dataSource.transaction(async (manager) => {
            const table = await manager.findOne(Table, {
                where: { id: tableId },
                lock: { mode: 'pessimistic_write' }
            })

            if (!table) {
                throw new NotFoundException('میز پیدا نشد')
            }


            if (table.status !== TableStatus.AVAILABLE) {
                throw new BadRequestException('این میز در حال حاضر ازاد نیست')
            }

            if (table.isActive === false) {
                throw new BadRequestException('این میز غیر فعال است')
            }

            const productIds = items.map((item) => item.productId)
            const products = await manager.find(Product, {
                where: { id: In(productIds) }
            })

            if (products.length !== new Set(productIds).size) {
                throw new NotFoundException('یک یا چند محصول پیدا نشد')
            }

            const productMap = new Map(products.map((p) => [p.id, p]))

            let totalAmount = 0

            const orderItemData: Partial<OrderItem>[] = []

            for (const item of items) {
                const product = productMap.get(item.productId)

                if (!product) {
                    throw new NotFoundException('محصول با این شناسه پیدا نشد')
                }

                if (product.isActive === false) {
                    throw new BadRequestException('محصول غیر فعال است')
                }

                if (!product.isAvailable) {
                    throw new BadRequestException('محصول موجود نیست')
                }
                const unitPrice = Number(product.discountPrice ?? product.price)
                const totalPrice = unitPrice * item.quantity
                totalAmount += totalPrice

                orderItemData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    unitPrice,
                    totalPrice
                })
            }

            const order = manager.create(Order, {
                status: OrderStatus.PENDING,
                totalAmount,
                discountAmount: 0,
                finalAmount: totalAmount - 0,
                notes,
                userId: user.id,
                tableId
            })


            const savedOrder = await manager.save(order)


            const orderItems = orderItemData.map((item) => manager.create(OrderItem, {
                ...item,
                orderId: savedOrder.id
            }))


            await manager.save(orderItems)


            table.status = TableStatus.OCCUPIED

            await manager.save(table)



            const fullOrder = await manager.findOne(Order, {
                where: { id: savedOrder.id },
                relations: {
                    items: {
                        product: true
                    },
                    table: true,
                    user: true
                }
            })


            if (!fullOrder) {
                throw new NotFoundException('سفارش ایجاد شد اما قابل بازیابی نبود')
            }

            return {
                id: fullOrder.id,
                status: fullOrder.status,
                totalAmount: Number(fullOrder.totalAmount),
                discountAmount: Number(fullOrder.discountAmount),
                finalAmount: Number(fullOrder.finalAmount),
                notes: fullOrder.notes,
                table: fullOrder.table
                    ? {
                        id: fullOrder.table.id,
                        number: fullOrder.table.number,
                        status: fullOrder.table.status,
                    }
                    : null,
                items: fullOrder.items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                    unitPrice: Number(item.unitPrice),
                    totalPrice: Number(item.totalPrice),
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        imageUrl: item.product.imageUrl,
                    },
                })),
                createdAt: fullOrder.createdAt,
            };



        })
    }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderStatus } from 'src/orders/order-status.enum';
import { PaymentStatus } from './payment.enum';
import { plainToInstance } from 'class-transformer';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        private dataSource: DataSource
    ) { }

    async createPayment(
        dto: CreatePaymentDto,
        currnetUser: User
    ): Promise<PaymentResponseDto> {
        return this.dataSource.transaction(async (manager) => {
            const order = await manager.findOne(Order, {
                where: { id: dto.orderId },
                lock: { mode: 'pessimistic_write' }
            })

            if (!order) {
                throw new NotFoundException('سفارش پیدا نشد')
            }

            if (order.status === OrderStatus.CANCELLED) {
                throw new BadRequestException('برای سفارش لغو شده نمی توان پرداخت ثبت کرد')
            }

            const paidResult = await manager
                .createQueryBuilder(Payment, 'payment')
                .select('COALESCE(SUM(payment.amount), 0 )', 'sum')
                .where('payment.orderId = :orderId', { orderId: order.id })
                .andWhere('payment.status = :status', { status: PaymentStatus.PAID })
                .getRawOne()


            const alreadyPaid = Number(paidResult?.sum) || 0
            const orderFinalAmount = Number(order.finalAmount)
            const newAmount = Number(dto.amount)

            if (newAmount <= 0) {
                throw new BadRequestException('مبلغ پرداخت باید بیشتر از صفر باشد')
            }

            if (alreadyPaid + newAmount > orderFinalAmount) {
                throw new BadRequestException(
                    `مبلغ پرداخت بیشتر از باقی‌مانده سفارش است. باقی‌مانده: ${orderFinalAmount - alreadyPaid}`,
                );
            }

            const payment = manager.create(Payment, {
                orderId: order.id,
                amount: newAmount,
                method: dto.method,
                status: PaymentStatus.PAID,
                note: dto.note,
                paidByUserId: currnetUser.id
            })

            const saved = await manager.save(payment)


            return plainToInstance(PaymentResponseDto, saved, {
                excludeExtraneousValues: true
            })
        })
    }

}

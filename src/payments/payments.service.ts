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
import { OrderResponseDto } from 'src/orders/dto/order-response.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
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


    async findByOrder(orderId): Promise<PaymentResponseDto[]> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } })

        if (!order) {
            throw new NotFoundException('سفارش پیدا نشد')
        }

        const payments = await this.paymentRepository.find({
            where: { orderId },
            order: { createdAt: 'DESC' }
        })


        return plainToInstance(PaymentResponseDto, payments, {
            excludeExtraneousValues: true
        })
    }


    async findOne(id: string): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.findOne({ where: { id } })

        if (!payment) {
            throw new NotFoundException('پرداخت پیدا نشد')
        }


        return plainToInstance(PaymentResponseDto, payment, {
            excludeExtraneousValues: true
        })
    }


    async updateStatus(id: string, dto: UpdatePaymentStatusDto): Promise<PaymentResponseDto> {
        return this.dataSource.transaction(async (manager) => {
            const payment = await manager.findOne(Payment, {
                where: { id },
                lock: { mode: 'pessimistic_write' }
            })


            if (!payment) {
                throw new NotFoundException('پرداخت پیدا نشد')
            }

            if (payment.status === dto.status) {
                return plainToInstance(PaymentResponseDto , payment ,{
                    excludeExtraneousValues: true
                })
            }

            const allowed:Record<PaymentStatus , PaymentStatus[]> = {
               [PaymentStatus.PENDING]: [PaymentStatus.PAID , PaymentStatus.FAILED] , 
               [PaymentStatus.PAID] : [PaymentStatus.REFUNDED] , 
               [PaymentStatus.FAILED] : [PaymentStatus.PENDING , PaymentStatus.PAID] , 
               [PaymentStatus.REFUNDED] : []
            }

            if (!allowed[payment.status]?.includes(dto.status)) {
                throw new BadRequestException(`تغییر وضعیت از ${payment.status} به ${dto.status} مجاز نیست`)
            }

            payment.status = dto.status 
            const saved = await manager.save(payment)

            return plainToInstance(PaymentResponseDto , saved , {
                excludeExtraneousValues: true
            })
        })
    }


    async getOrderPaymentSummary(orderId: string) {
        const order = await this.orderRepository.findOne({where : {id: orderId}})

        if (!order) {
            throw new NotFoundException('سفارش پیدا نشد')
        }

        const result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select('COALESCE(SUM(payment.amount),0)' , 'sum')
        .where('payment.orderId = :orderId' , {orderId})
        .andWhere('payment.status = :status' , {status: PaymentStatus.PAID})
        .getRawOne()

        const paidAmount = Number(result?.sum) || 0 
        const finalAmount = Number(order.finalAmount)
        const remainingAmount = Math.max(finalAmount - paidAmount , 0)

        return {
            orderId: order.id , 
            finalAmount , 
            paidAmount , 
            remainingAmount , 
            isFullyPaid: paidAmount >= finalAmount
        }

    }





    
}

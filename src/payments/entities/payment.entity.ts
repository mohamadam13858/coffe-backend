import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentMethod, PaymentStatus } from "../payment.enum";




@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    orderId: string 

    @ManyToOne(() => Order)
    order: Order 

    @Column({type: 'decimal' , precision: 10 , scale: 2})
    amount: number

    @Column({type: 'enum' , enum: PaymentMethod})
    method: PaymentMethod 

    @Column({type:'enum' , enum:PaymentStatus , default: PaymentStatus.PAID })
    status: PaymentStatus

    @Column({nullable: true})
    note?: string 

    @Column()
    paidByUserId: string

    @CreateDateColumn()
    createdAt: Date 

    @UpdateDateColumn()
    updatedAt: Date
}
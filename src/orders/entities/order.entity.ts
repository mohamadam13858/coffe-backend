import { User } from "src/auth/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderStatus } from "../order-status.enum";
import { OrderItem } from "./order-item.entity";
import { Table } from "src/table/entities/table.entity";



@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discountAmount: number
    @Column({ nullable: true })
    notes?: string
    @ManyToOne(() => User)
    user: User
    @Column()
    userId: string 
    @ManyToOne(()=> Table , {nullable: true})
    table?: string
    @Column({nullable: true})
    tableId: string
    @OneToMany(() => OrderItem , (item) => item.order , {   cascade: true})
    items: OrderItem[]
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date

}
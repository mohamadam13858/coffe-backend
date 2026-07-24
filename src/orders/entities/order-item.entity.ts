import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/menu/entities/product.entity";



@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @ManyToOne(() => Order, (order) => order.items)
    order: Order
    @Column()
    orderId: string
    @ManyToOne(() => Product)
    product: Product
    @Column()
    productId: string
    @Column()
    quantity: number 
    @Column({type: 'decimal' , precision: 10 , scale: 2})
    unitPrice: number
    @Column({type: 'decimal' , precision: 10 , scale: 2})
    totalPrice : number
    

}
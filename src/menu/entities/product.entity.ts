import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity"
import { Express } from 'express';;



@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ length: 100 })
    name: string
    @Column({ length: 200, nullable: true })
    description?: string
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discountPrice?: number
    @Column({ default: true })
    isAvailable: boolean
    @Column({ default: 0 })
    stock: number
    @Column({ default: 0 })
    orderCount: number
    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category
    @Column()
    categoryId: string
    @Column({ nullable: true })
    imageUrl: string
    @Column({ default: true })
    isActive: boolean
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date
}
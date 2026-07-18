import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
import { User } from "src/auth/user.entity";



@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ length: 80, unique: true })
    name: string
    @Column({ length: 200, nullable: true })
    description: string
    @Column({ nullable: true })
    imageUrl: string
    @Column({ default: 0 })
    orderIndex: number
    @Column({ default: true })
    isActive: boolean
    @OneToMany(() => Product, (product) => product.category)
    products: Product[]
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    @DeleteDateColumn()
    deletedAt: Date
}
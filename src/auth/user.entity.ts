import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.enum";



@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ unique: true })
    mobile: string
    @Column({ unique: true, nullable: true })
    email: string
    @Column()
    password: string
    @Column({ type: 'enum', enum: Role })
    role: Role
    @Column({ length: 100, nullable: true })
    firstName: string
    @Column({ length: 100, nullable: true })
    lastName: string
    @Column({ default: true })
    isActive: boolean
    @Column({ default: false })
    isVerified: boolean
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
}

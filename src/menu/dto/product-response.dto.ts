import { Expose } from "class-transformer"
import e from "express"



export class ProductResponseDto {
    @Expose()
    id: string

    @Expose()
    name: string

    @Expose()
    description?: string

    @Expose()
    price: number

    @Expose()
    discountPrice: number

    @Expose()
    isAvailable: boolean

    @Expose()
    stock: number

    @Expose()
    imageUrl?: string

    @Expose()
    isActive: boolean

    @Expose()
    orderCount: number

    @Expose()
    categoryId: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}

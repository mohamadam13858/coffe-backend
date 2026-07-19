import { IsBoolean, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";



export class UpdateProductDto {
    @IsOptional()
    name: string
    @IsOptional()
    description?: string
    @IsOptional()
    @IsNumber()
    price: number
    @IsOptional()
    @IsNumber()
    discountPrice?: number
    @IsOptional()
    @IsUUID()
    categoryId: string
    @IsOptional()
    imageUrl?: string
    @IsOptional()
    @IsNumber()
    stock?: number
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean
}
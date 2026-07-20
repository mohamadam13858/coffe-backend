import { IsBoolean, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";



export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name: string
    @IsOptional()
    @IsString()
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
    @IsNumber()
    @Min(0)
    stock?: number
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean
}
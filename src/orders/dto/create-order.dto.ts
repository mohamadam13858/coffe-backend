import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";



export class CreateOrderItemDto {
    @IsNotEmpty()
    @IsUUID()
    productId: string

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number
}



export class CreateOrderDto {
    @IsNotEmpty()
    @IsUUID()
    tableId: string

    @IsOptional()
    @IsString()
    notes?: string

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]

}
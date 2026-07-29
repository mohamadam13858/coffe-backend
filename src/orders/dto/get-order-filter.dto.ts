import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { OrderStatus } from "../order-status.enum";
import { Type } from "class-transformer";





export class GetOrdersFilterDto {
    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus

    @IsOptional()
    @IsUUID()
    tableId?: string

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}
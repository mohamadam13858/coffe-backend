import { IsOptional, IsString } from "class-validator";



export class GetProductsFilterDto {
    @IsOptional()
    @IsString()
    search?: string
}
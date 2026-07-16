import { IsOptional, IsString, IsUUID } from "class-validator";



export class GetProductsFilterDto {
    @IsOptional()
    @IsString()
    search?: string


    @IsOptional()
    @IsUUID()
    categoryId: string  
}
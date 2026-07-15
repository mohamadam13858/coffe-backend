import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string
    @IsOptional()
    description: string
    @IsOptional()
    imageUrl: string
    @IsOptional()
    @IsNumber()
    orderIndex: number
}
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
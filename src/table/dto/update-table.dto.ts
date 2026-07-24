import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TableStatus } from "../table-status.enum";


export class UpdateTableDto {
    @IsOptional()
    @IsString()
    number?: string;

    @IsOptional()
    @IsNumber()
    capacity?: number;

    @IsOptional()
    @IsEnum(TableStatus)
    status?: TableStatus;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
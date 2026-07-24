import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TableStatus } from "../table-status.enum";


export class CreateTableDto {
    @IsNotEmpty({ message: 'شماره میز اجباری است' })
    @IsString()
    number: string

    @IsOptional()
    @IsNumber()
    capacity?: number

    @IsOptional()
    @IsEnum(TableStatus)
    status?: TableStatus = TableStatus.AVAILABLE

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true
}
import { IsEnum, IsNotEmpty } from "class-validator";
import { TableStatus } from "../table-status.enum";


export class ChangeStatusTableDto {
    @IsNotEmpty()
    @IsEnum(TableStatus)
    status: TableStatus
}
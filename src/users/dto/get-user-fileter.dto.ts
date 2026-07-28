import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../enums/role.enum";


export class GetUserFilterDto{
    @IsOptional()
    @IsString()
    search?:string

    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    @IsOptional()
    page?: Number = 1

    @IsOptional()
    limit?: Number = 10
}
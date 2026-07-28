import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Role } from "../enums/role.enum";
import { Type } from "class-transformer";


export class GetUserFilterDto {
    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: Number = 1

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: Number = 10
}
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Role } from "../enums/role.enum";
import { Transform, Type } from "class-transformer";


export class GetUserFilterDto {
    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
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
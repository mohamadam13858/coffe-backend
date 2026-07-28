import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "../enums/role.enum";




export class UserRoleDto {
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role

}
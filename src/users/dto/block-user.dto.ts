import { IsBoolean, IsNotEmpty } from "class-validator";



export class BlockUserDto{
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean
}



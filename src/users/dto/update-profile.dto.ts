import { IsEmail, IsOptional, IsString, Length } from "class-validator";



export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @Length(2 , 20) 
    firstName?: string


    @IsOptional()
    @IsString()
    @Length(2 , 50)
    lastName?: string


    @IsOptional()
    @IsEmail()
    email?: string
}
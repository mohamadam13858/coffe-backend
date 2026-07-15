import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";
import { Role } from "../role.enum";


export class RegisterDto {
    @IsNotEmpty({ message: "شماره موبایل اجباری است" })
    @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل معتبر نیست' })
    mobile: string


    @IsOptional()
    @IsEmail({}, { message: 'ایمیل معتبر نیست' })
    email?: string

    @IsNotEmpty({ message: "رمز عبور اجباری است" })
    @Length(8, 25, { message: 'رمز عبور باید بین ۸ تا ۲۵ کاراکتر باشد' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'رمز عبور باید شامل حرف بزرگ. کوچک و عدد یا کاراکتر خاص باشد '
    })
    password: string

    @IsOptional()
    @Length(2, 50, { message: 'نام باید بین ۲ تا ۵۰ کاراکتر باشد' })
    firstName?: string

    @IsOptional()
    @Length(2, 50, { message: 'نام خانوادگی باید بین ۲ تا ۵۰ کاراکتر باشد' })
    lastName?: string


    @IsOptional()
    @IsEnum(Role, { message: 'نقش معتبر نیست' })
    role?: Role = Role.CUSTOMER




}
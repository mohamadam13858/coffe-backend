import { IsMobilePhone, IsNotEmpty, Length, Matches } from "class-validator"



export class LoginDto {
    @IsNotEmpty({ message: "شماره موبایل اجباری است" })
    @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل معتبر نیست' })
    mobile: string


    @IsNotEmpty({ message: "رمز عبور اجباری است" })
    @Length(8, 25, { message: 'رمز عبور باید بین ۸ تا ۲۵ کاراکتر باشد' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'رمز عبور باید شامل حرف بزرگ. کوچک و عدد یا کاراکتر خاص باشد '
    })
    password: string

}
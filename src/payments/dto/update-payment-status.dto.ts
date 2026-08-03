import { IsEnum, IsNotEmpty } from "class-validator";
import { PaymentStatus } from "../payment.enum";



export class UpdatePaymentStatusDto {
    @IsNotEmpty()
    @IsEnum(PaymentStatus)
    status: PaymentStatus
}
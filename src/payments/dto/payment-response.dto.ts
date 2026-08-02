import { Expose } from "class-transformer";
import { PaymentMethod, PaymentStatus } from "../payment.enum";




export class PaymentResponseDto {
    @Expose()
    id: string

    @Expose()
    orderId: string

    @Expose()
    amount: number 

    @Expose()
    method: PaymentMethod

    @Expose()
    status: PaymentStatus

    @Expose()
    note?: string

    @Expose()
    paidByUserId: string

    @Expose()
    createdAt: Date 

    @Expose()
    updatedAt: Date
}
import { IsIn, IsInt, IsNotEmpty, Min } from "class-validator";



export class UpdateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number

}
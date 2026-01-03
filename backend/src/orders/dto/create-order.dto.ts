import { IsArray, isNotEmpty, IsNotEmpty, isNumber, IsNumber, Min, min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OrdersModule } from "../orders.module";

class OrderItemDto {
    @IsNotEmpty()
    @IsNumber()
    fruitId : number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1) 
    quantity : number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true}) 
    @Type(() => OrderItemDto) 
    items : OrderItemDto[];
}

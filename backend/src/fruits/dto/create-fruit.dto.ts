import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFruitDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0) // ราคาห้ามต่ำกว่า 0
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0) // จำนวนสต็อกห้ามต่ำกว่า 0
  stock: number;
}
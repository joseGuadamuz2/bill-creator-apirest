import { IsNotEmpty, IsNumber, IsString, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 999.99 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

}
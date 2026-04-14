import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBillDetailDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: 999.99, description: 'Si no se envía, se usa el precio del producto' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number; // opcional, si el usuario lo modifica desde el front
}
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Laptop' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 999.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

}
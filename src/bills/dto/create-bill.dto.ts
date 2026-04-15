import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateBillDetailDto } from './create-bill-detail.dto';

export class CreateBillDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @ApiProperty({ example: 'BILL-001' })
  @IsNotEmpty()
  @IsString()
  billNumber: string;

  @ApiProperty({ type: [CreateBillDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBillDetailDto)
  details: CreateBillDetailDto[];
}
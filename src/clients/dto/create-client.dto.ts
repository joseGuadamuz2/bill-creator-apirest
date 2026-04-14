import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '+506 8888-8888' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'San José, Costa Rica' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
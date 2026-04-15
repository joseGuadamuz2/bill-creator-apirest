import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Mi Empresa S.A.' })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ example: '+506 2222-2222' })
  @IsOptional()
  @IsString()
  businessPhone?: string;

  @ApiPropertyOptional({ example: 'San José, Costa Rica' })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiPropertyOptional({ example: 'empresa@email.com' })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;
}
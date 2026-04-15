import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('products')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateProductDto, @Req() req: Request) {
    const user = req.user as any;
    return this.productsService.create(dto, user.id, user.email);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener mis productos activos' })
  findAll(@Req() req: Request) {
    return this.productsService.findAll((req.user as any).id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.productsService.findOne(+id, (req.user as any).id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', type: 'number' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Req() req: Request) {
    return this.productsService.update(+id, dto, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado lógico de un producto' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.productsService.remove(+id, user.id, user.email);
  }
}
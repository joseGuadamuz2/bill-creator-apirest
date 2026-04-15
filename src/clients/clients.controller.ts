<<<<<<< HEAD
import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
=======
import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3
import { Request } from 'express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('clients')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
<<<<<<< HEAD
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateClientDto, @Req() req: Request) {
    const user = req.user as any;
    return this.clientsService.create(dto, user.id, user.email);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener mis clientes activos' })
=======
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  create(@Body() dto: CreateClientDto, @Req() req: Request) {
    return this.clientsService.create(dto, (req.user as any).id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes activos' })
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3
  findAll(@Req() req: Request) {
    return this.clientsService.findAll((req.user as any).id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.clientsService.findOne(+id, (req.user as any).id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', type: 'number' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto, @Req() req: Request) {
    return this.clientsService.update(+id, dto, (req.user as any).id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado lógico de un cliente' })
  @ApiParam({ name: 'id', type: 'number' })
<<<<<<< HEAD
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.clientsService.remove(+id, user.id, user.email);
=======
  @ApiQuery({ name: 'deletedBy', type: 'string', example: 'admin' })
  remove(@Param('id') id: string, @Query('deletedBy') deletedBy: string, @Req() req: Request) {
    return this.clientsService.remove(+id, deletedBy, (req.user as any).id);
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3
  }
}
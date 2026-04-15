import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateClientDto, @Req() req: Request) {
    const user = req.user as any;
    return this.clientsService.create(dto, user.id, user.email);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener mis clientes activos' })
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
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.clientsService.remove(+id, user.id, user.email);
  }
}
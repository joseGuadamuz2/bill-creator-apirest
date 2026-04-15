// Ejemplo: cómo proteger rutas y documentarlas en Swagger
// (por ejemplo clients.controller.ts)

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('clients')
@ApiBearerAuth('access-token')   // 👈 indica a Swagger que este controller requiere JWT
@UseGuards(JwtAuthGuard)          // 👈 protege todas las rutas del controller
@Controller('clients')
export class ClientsController {

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes (requiere JWT)' })
  findAll(@Req() req) {
    console.log('Usuario autenticado:', req.user); // { id, email, name, ... }
    // ...
  }
}

// Si quieres proteger solo algunos endpoints, aplica los decoradores por ruta:
//
// @Get(':id')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth('access-token')
// @ApiOperation({ summary: 'Obtener cliente por ID (requiere JWT)' })
// findOne(@Param('id') id: string, @Req() req) { ... }
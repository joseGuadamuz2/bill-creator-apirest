import { Controller, Get, Post, Body, Param, Delete, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { BillsService } from './bills.service';
import { PdfService } from './pdf.service';
import { CreateBillDto } from './dto/create-bill.dto';

@ApiTags('bills')
@Controller('bills')
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva factura' })
  @ApiResponse({ status: 201, description: 'Factura creada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente o producto no encontrado' })
  create(@Body() dto: CreateBillDto) {
    return this.billsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas activas' })
  findAll() {
    return this.billsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  findOne(@Param('id') id: string) {
    return this.billsService.findOne(+id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Descargar factura en PDF' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'PDF generado exitosamente' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const bill = await this.billsService.findOne(+id);
    const pdfBuffer = await this.pdfService.generateBillPdf(bill);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="factura-${bill.billNumber}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Anular una factura (borrado lógico)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiQuery({ name: 'deletedBy', type: 'string', example: 'admin' })
  remove(@Param('id') id: string, @Query('deletedBy') deletedBy: string) {
    return this.billsService.remove(+id, deletedBy);
  }
}
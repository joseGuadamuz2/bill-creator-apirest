import { Controller, Get, Post, Body, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { BillsService } from './bills.service';
import { PdfService } from './pdf.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('bills')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('bills')
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva factura' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateBillDto, @Req() req: Request) {
    const user = req.user as any;
    return this.billsService.create(dto, user.id, user.email);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener mis facturas activas' })
  findAll(@Req() req: Request) {
    return this.billsService.findAll((req.user as any).id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.billsService.findOne(+id, (req.user as any).id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Descargar factura en PDF' })
  @ApiParam({ name: 'id', type: 'number' })
  async downloadPdf(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const bill = await this.billsService.findOne(+id, (req.user as any).id);
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
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.billsService.remove(+id, user.id, user.email);
  }
}
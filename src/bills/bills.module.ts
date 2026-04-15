import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './bill.entity';
import { BillDetail } from './bill-detail.entity';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { ProductsModule } from '../products/products.module';
import { PdfService } from './pdf.service';
import { Client } from '../clients/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, BillDetail, Client]),
    ProductsModule,
  ],
  controllers: [BillsController],
  providers: [BillsService, PdfService],
  exports: [BillsService],
})
export class BillsModule {}
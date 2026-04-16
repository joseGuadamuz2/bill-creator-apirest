import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './bill.entity';
import { BillDetail } from './bill-detail.entity';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { ProductsModule } from '../products/products.module';
import { ClientsModule } from '../clients/clients.module';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, BillDetail]),
    ProductsModule,
    ClientsModule,
  ],
  controllers: [BillsController],
  providers: [BillsService, PdfService],
  exports: [BillsService],
})
export class BillsModule {}
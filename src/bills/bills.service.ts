import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import { BillDetail } from './bill-detail.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { ProductsService } from '../products/products.service';


@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,

    @InjectRepository(BillDetail)
    private billDetailsRepository: Repository<BillDetail>,

    private productsService: ProductsService,
  ) {}

  async create(dto: CreateBillDto): Promise<Bill> {
    // Verificar que el número de factura no exista
    const existing = await this.billsRepository.findOneBy({ billNumber: dto.billNumber });
    if (existing) {
      throw new ConflictException(`Ya existe una factura con el número ${dto.billNumber}`);
    }

    let total = 0;
    const details: BillDetail[] = [];

    for (const detailDto of dto.details) {
      const product = await this.productsService.findOne(detailDto.productId);
      const unitPrice = detailDto.unitPrice ?? Number(product.price);
      const subtotal = unitPrice * detailDto.quantity;
      total += subtotal;

      const detail = this.billDetailsRepository.create({
        productId: detailDto.productId,
        quantity: detailDto.quantity,
        unitPrice,
        subtotal,
      });
      details.push(detail);
    }

    const bill = this.billsRepository.create({
      billNumber: dto.billNumber,
      clientId: dto.clientId,
      createdBy: dto.createdBy,
      total,
      details,
    });

    return this.billsRepository.save(bill);
  }

  findAll(): Promise<Bill[]> {
    return this.billsRepository.find({
      where: { isActive: true },
      relations: ['client', 'details', 'details.product'],
    });
  }

  async findOne(id: number): Promise<Bill> {
    const bill = await this.billsRepository.findOne({
      where: { id, isActive: true },
      relations: ['client', 'details', 'details.product'],
    });
    if (!bill) throw new NotFoundException(`Factura con id ${id} no encontrada`);
    return bill;
  }

  async remove(id: number, deletedBy: string): Promise<void> {
    const bill = await this.findOne(id);
    bill.isActive = false;
    bill.updatedBy = deletedBy;
    await this.billsRepository.save(bill);
  }
}
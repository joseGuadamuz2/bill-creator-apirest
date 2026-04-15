import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import { BillDetail } from './bill-detail.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { ProductsService } from '../products/products.service';
import { Client } from '../clients/client.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,

    @InjectRepository(BillDetail)
    private billDetailsRepository: Repository<BillDetail>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    private productsService: ProductsService,
  ) {}

  async create(dto: CreateBillDto, createdBy: string, userId: number): Promise<Bill> {
    const existing = await this.billsRepository.findOne({ where: { billNumber: dto.billNumber, userId } });
    if (existing) {
      throw new ConflictException(`Ya existe una factura con el número ${dto.billNumber}`);
    }

    const client = await this.clientRepository.findOne({ where: { id: dto.clientId, userId, isActive: true } });
    if (!client) {
      throw new NotFoundException(`Cliente con id ${dto.clientId} no encontrado para este usuario`);
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
      userId,
      createdBy,
      total,
      details,
    });

    return this.billsRepository.save(bill);
  }

  findAll(userId: number): Promise<Bill[]> {
    return this.billsRepository.find({
      where: { userId, isActive: true },
      relations: ['client', 'details', 'details.product', 'user'],
    });
  }

  async findOne(id: number, userId: number): Promise<Bill> {
    const bill = await this.billsRepository.findOne({
      where: { id, userId, isActive: true },
      relations: ['client', 'details', 'details.product', 'user'],
    });
    if (!bill) throw new NotFoundException(`Factura con id ${id} no encontrada`);
    return bill;
  }

  async remove(id: number, deletedBy: string, userId: number): Promise<void> {
    const bill = await this.findOne(id, userId);
    bill.isActive = false;
    bill.updatedBy = deletedBy;
    await this.billsRepository.save(bill);
  }
}
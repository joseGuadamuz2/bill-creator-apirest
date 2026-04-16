import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import { BillDetail } from './bill-detail.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { ProductsService } from '../products/products.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,

    @InjectRepository(BillDetail)
    private billDetailsRepository: Repository<BillDetail>,

    private productsService: ProductsService,
    private clientsService: ClientsService,
  ) {}

  async create(dto: CreateBillDto, userId: number, createdBy: string): Promise<Bill> {
    const existing = await this.billsRepository.findOneBy({ billNumber: dto.billNumber, userId });
    if (existing) {
      throw new ConflictException(`Ya existe una factura con el número ${dto.billNumber}`);
    }

    // Valida que el cliente pertenezca al usuario autenticado
    await this.clientsService.findOne(dto.clientId, userId);

    let total = 0;
    const details: BillDetail[] = [];

    for (const detailDto of dto.details) {
      // Valida que el producto pertenezca al usuario autenticado
      const product = await this.productsService.findOne(detailDto.productId, userId);
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
      where: { isActive: true, userId },
      relations: ['client', 'details', 'details.product'],
    });
  }

  async findOne(id: number, userId: number): Promise<Bill> {
    const bill = await this.billsRepository.findOne({
      where: { id, isActive: true, userId },
      relations: ['client', 'details', 'details.product', 'user'],
    });
    if (!bill) throw new NotFoundException(`Factura con id ${id} no encontrada`);
    return bill;
  }

  async remove(id: number, userId: number, deletedBy: string): Promise<void> {
    const bill = await this.findOne(id, userId);
    bill.isActive = false;
    bill.updatedBy = deletedBy;
    await this.billsRepository.save(bill);
  }
}
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import { BillDetail } from './bill-detail.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { ProductsService } from '../products/products.service';
<<<<<<< HEAD
import { ClientsService } from '../clients/clients.service';
=======
import { Client } from '../clients/client.entity';
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3

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
    private clientsService: ClientsService,
  ) {}

<<<<<<< HEAD
  async create(dto: CreateBillDto, userId: number, createdBy: string): Promise<Bill> {
    const existing = await this.billsRepository.findOneBy({ billNumber: dto.billNumber, userId });
=======
  async create(dto: CreateBillDto, createdBy: string, userId: number): Promise<Bill> {
    const existing = await this.billsRepository.findOne({ where: { billNumber: dto.billNumber, userId } });
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3
    if (existing) {
      throw new ConflictException(`Ya existe una factura con el número ${dto.billNumber}`);
    }

<<<<<<< HEAD
    // Validar que el cliente pertenezca al usuario
    await this.clientsService.findOne(dto.clientId, userId);
=======
    const client = await this.clientRepository.findOne({ where: { id: dto.clientId, userId, isActive: true } });
    if (!client) {
      throw new NotFoundException(`Cliente con id ${dto.clientId} no encontrado para este usuario`);
    }
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3

    let total = 0;
    const details: BillDetail[] = [];

    for (const detailDto of dto.details) {
      // Validar que el producto pertenezca al usuario
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
<<<<<<< HEAD
      where: { isActive: true, userId },
      relations: ['client', 'details', 'details.product'],
=======
      where: { userId, isActive: true },
      relations: ['client', 'details', 'details.product', 'user'],
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3
    });
  }

  async findOne(id: number, userId: number): Promise<Bill> {
    const bill = await this.billsRepository.findOne({
<<<<<<< HEAD
      where: { id, isActive: true, userId },
=======
      where: { id, userId, isActive: true },
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3
      relations: ['client', 'details', 'details.product', 'user'],
    });
    if (!bill) throw new NotFoundException(`Factura con id ${id} no encontrada`);
    return bill;
  }

<<<<<<< HEAD
  async remove(id: number, userId: number, deletedBy: string): Promise<void> {
=======
  async remove(id: number, deletedBy: string, userId: number): Promise<void> {
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3
    const bill = await this.findOne(id, userId);
    bill.isActive = false;
    bill.updatedBy = deletedBy;
    await this.billsRepository.save(bill);
  }
}
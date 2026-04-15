import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(dto: CreateProductDto, userId: number, createdBy: string): Promise<Product> {
    const product = this.productsRepository.create({ ...dto, userId, createdBy });
    return this.productsRepository.save(product);
  }

  findAll(userId: number): Promise<Product[]> {
    return this.productsRepository.findBy({ isActive: true, userId });
  }

  async findOne(id: number, userId: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id, isActive: true, userId });
    if (!product) throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto, userId: number): Promise<Product> {
    const product = await this.findOne(id, userId);
    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async remove(id: number, userId: number, deletedBy: string): Promise<void> {
    const product = await this.findOne(id, userId);
    product.isActive = false;
    product.updatedBy = deletedBy;
    await this.productsRepository.save(product);
  }
}

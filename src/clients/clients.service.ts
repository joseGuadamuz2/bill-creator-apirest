import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  create(dto: CreateClientDto, userId: number, createdBy: string): Promise<Client> {
    const client = this.clientsRepository.create({ ...dto, userId, createdBy });
    return this.clientsRepository.save(client);
  }

  findAll(userId: number): Promise<Client[]> {
    return this.clientsRepository.findBy({ isActive: true, userId });
  }

  async findOne(id: number, userId: number): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id, isActive: true, userId });
    if (!client) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return client;
  }

  async update(id: number, dto: UpdateClientDto, userId: number): Promise<Client> {
    const client = await this.findOne(id, userId);
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  async remove(id: number, userId: number, deletedBy: string): Promise<void> {
    const client = await this.findOne(id, userId);
    client.isActive = false;
    client.updatedBy = deletedBy;
    await this.clientsRepository.save(client);
  }
}
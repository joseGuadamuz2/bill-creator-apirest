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

  create(dto: CreateClientDto, userId: number): Promise<Client> {
    const client = this.clientsRepository.create({ ...dto, userId });
    return this.clientsRepository.save(client);
  }

  findAll(userId: number): Promise<Client[]> {
    // Solo retorna los activos del usuario autenticado
    return this.clientsRepository.find({ where: { userId, isActive: true } });
  }

  async findOne(id: number, userId: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id, userId, isActive: true } });
    if (!client) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return client;
  }

  async update(id: number, dto: UpdateClientDto, userId: number): Promise<Client> {
    const client = await this.findOne(id, userId);
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  // Borrado lógico — no elimina el registro
  async remove(id: number, deletedBy: string, userId: number): Promise<void> {
    const client = await this.findOne(id, userId);
    client.isActive = false;
    client.updatedBy = deletedBy;
    await this.clientsRepository.save(client);
  }
}


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

  create(dto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(dto);
    return this.clientsRepository.save(client);
  }

  findAll(): Promise<Client[]> {
    // Solo retorna los activos
    return this.clientsRepository.findBy({ isActive: true });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id, isActive: true });
    if (!client) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return client;
  }

  async update(id: number, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  // Borrado lógico — no elimina el registro
  async remove(id: number, deletedBy: string): Promise<void> {
    const client = await this.findOne(id);
    client.isActive = false;
    client.updatedBy = deletedBy;
    await this.clientsRepository.save(client);
  }
}


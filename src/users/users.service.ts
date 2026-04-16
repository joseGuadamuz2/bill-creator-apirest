import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(email: string, password: string, name?: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }
    const user = this.usersRepository.create({ email, password, name, createdBy: email });
    return this.usersRepository.save(user);
  }

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<Omit<User, 'password' | 'hashPassword'>> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    const saved = await this.usersRepository.save(user);
    const { password, hashPassword, ...result } = saved;
    return result;
  }
}
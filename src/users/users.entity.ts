import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  // Datos para impresión personalizada en PDF
  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessPhone: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  businessEmail: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
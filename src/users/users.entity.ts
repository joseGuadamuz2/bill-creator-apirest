import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import * as bcrypt from 'bcrypt';
import { Client } from '../clients/client.entity';
import { Bill } from '../bills/bill.entity';

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

<<<<<<< HEAD
  // Datos para impresión personalizada en PDF
  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessPhone: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  businessEmail: string;
=======
  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true, type: 'text' })
  logoUrl: string;

  @OneToMany(() => Client, (client) => client.user)
  clients: Client[];

  @OneToMany(() => Bill, (bill) => bill.user)
  bills: Bill[];
>>>>>>> b567cb105cf15bf0649098b226c92e78159b9cc3

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
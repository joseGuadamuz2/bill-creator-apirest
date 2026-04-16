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

  // Datos para impresión personalizada en PDF
  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessPhone: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  businessEmail: string;

  @OneToMany(() => Client, (client) => client.user)
  clients: Client[];

  @OneToMany(() => Bill, (bill) => bill.user)
  bills: Bill[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
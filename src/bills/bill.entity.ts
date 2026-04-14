import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Client } from '../clients/client.entity';
import { BillDetail } from './bill-detail.entity';

@Entity('bills')
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  billNumber: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  clientId: number;

  @OneToMany(() => BillDetail, (detail) => detail.bill, { cascade: true })
  details: BillDetail[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;
}
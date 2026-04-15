import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { Client } from '../clients/client.entity';
import { BillDetail } from './bill-detail.entity';
import { User } from '../users/users.entity';

@Entity('bills')
@Index(['billNumber', 'userId'], { unique: true })
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  billNumber: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  clientId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => BillDetail, (detail) => detail.bill, { cascade: true })
  details: BillDetail[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;
}
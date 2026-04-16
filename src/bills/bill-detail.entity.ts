import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { type Bill } from './bill.entity';
import { Product } from '../products/product.entity';

@Entity('bill_details')
export class BillDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Bill', (bill: Bill) => bill.details)
  @JoinColumn({ name: 'billId' })
  bill: Bill;

  @Column()
  billId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
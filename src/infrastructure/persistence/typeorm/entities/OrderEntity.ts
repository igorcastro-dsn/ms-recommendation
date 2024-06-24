import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItemEntity } from './OrderItemEntity'

@Entity('orders')
export class OrderEntity {
    
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', name: 'total_amount' })
  totalAmount: number;

  @OneToMany(() => OrderItemEntity, item => item.order, { cascade: true })
  items: OrderItemEntity[];

  @Column({ name: 'created_at' })
  createdAt: Date;

}

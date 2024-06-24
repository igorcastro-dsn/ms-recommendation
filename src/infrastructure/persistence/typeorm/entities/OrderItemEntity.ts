import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from './OrderEntity';

@Entity('order_items')
export class OrderItemEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'product_id'})
  productId: string;

  @Column({type: 'decimal', name: 'unit_price'})
  unitPrice: number;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderEntity, order => order.items)
  order: OrderEntity;
  
}

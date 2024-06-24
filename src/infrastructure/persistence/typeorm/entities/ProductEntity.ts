import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class ProductEntity {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;
  
}

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ProductEntity } from '../persistence/typeorm/entities/ProductEntity';
import { OrderEntity } from '../persistence/typeorm/entities/OrderEntity';
import { OrderItemEntity } from '../persistence/typeorm/entities/OrderItemEntity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'recommendation',
  synchronize: true,
  logging: false,
  entities: [ProductEntity, OrderEntity, OrderItemEntity],
  migrations: [],
  subscribers: [],
});

export { AppDataSource }
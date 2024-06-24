import { Product } from '../entities/Product';

export interface IProductRepository {

  create(product: Product): Promise<Product>;

  findById(id: string): Promise<Product | null>;

  findAll(): Promise<Product[]>;

  findByIds(ids: any[]): Promise<Product[]>;

  delete(id: string): Promise<void>;

}

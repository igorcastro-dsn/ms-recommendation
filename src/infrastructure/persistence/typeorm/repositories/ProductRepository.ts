import { injectable } from 'tsyringe';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '../entities/ProductEntity';
import { IProductRepository } from '../../../../domain/product/repositories/IProductRepository';
import { Product } from '../../../../domain/product/entities/Product';
import { AppDataSource } from '../../../config/data-source-config';

@injectable()
export class ProductRepository implements IProductRepository {

  private repository: Repository<ProductEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductEntity);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id: id} });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const productEntities = await this.repository.findBy({ id: In(ids) });
    return productEntities.map(entity => this.mapToDomain(entity));
  }

  async findAll(): Promise<Product[]> {
    const products = await this.repository.find();
    return products.map(entity => this.mapToDomain(entity))
  }

  async create(product: Product): Promise<Product> {
    const entity = await this.repository.save({
      sku: product.sku,
      name: product.name,
      price: product.price
    });
    return this.mapToDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: ProductEntity): Product {
    const product = new Product(entity.sku, entity.name, entity.price);
    product.setId(entity.id as string);
    return product;
  }

}

import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { Product } from '../../domain/product/entities/Product';

@injectable()
export class ProductService {

  constructor(
    @inject('ProductRepository') private productRepository: IProductRepository
  ) {}

  async createProduct(sku: string, name: string, price: number): Promise<Product> {
    const product = new Product(sku, name, price);
    return await this.productRepository.create(product);
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

}

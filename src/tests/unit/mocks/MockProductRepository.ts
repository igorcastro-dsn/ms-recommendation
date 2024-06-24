import { v4 as uuidv4 } from 'uuid';
import { IProductRepository } from '../../../domain/product/repositories/IProductRepository';
import { Product } from '../../../domain/product/entities/Product';

export class MockProductRepository implements IProductRepository {
  
    private products: Product[] = [];
  
    async create(product: Product): Promise<Product> {
      product.setId(uuidv4())
      this.products.push(product);
      return product;
    }
  
    async findById(id: string): Promise<Product | null> {
      return this.products.find(p => p.getId() === id) || null;
    }
  
    async findByIds(ids: any[]): Promise<Product[]> {
      const foundProducts: Product[] = [];
      ids.forEach(id => {
        const product = this.products.find(p => p.getId() === id);
        if (product) {
          foundProducts.push(product);
        }
      });
      return foundProducts;
    }
  
    async findAll(): Promise<Product[]> {
      return this.products;
    }
  
    async delete(id: string): Promise<void> {
      const index = this.products.findIndex(p => p.getId() === id);
      if (index !== -1) {
        this.products.splice(index, 1);
      }
    }
  }
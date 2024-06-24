import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ProductService } from '../services/ProductService';

@injectable()
export class ProductController {

  constructor(
    @inject(ProductService) private productService: ProductService
  ) {}

  async createProduct(req: Request, res: Response): Promise<void> {
    const { sku, name, price } = req.body;
    const createdProduct = await this.productService.createProduct(sku, name, price);
    res.status(201).send(createdProduct);
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    if (!product) {
      res.status(404).send({ message: 'Product not found' });
      return;
    }
    res.send(product);
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await this.productService.getAllProducts();
    res.send(products);
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.productService.deleteProduct(id);
    res.status(204).send();
  }

}

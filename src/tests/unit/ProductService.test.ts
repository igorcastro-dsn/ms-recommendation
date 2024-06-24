import 'reflect-metadata';
import { ProductService } from '../../application/services/ProductService';
import { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { Product } from '../../domain/product/entities/Product';
import { container } from 'tsyringe';
import { MockProductRepository } from './mocks/MockProductRepository';

describe('ProductService', () => {
  
  let productService: ProductService;
  let mockProductRepository: MockProductRepository;

  beforeEach(() => {
    mockProductRepository = new MockProductRepository();
    container.registerInstance<IProductRepository>('ProductRepository', mockProductRepository);
    productService = new ProductService(container.resolve('ProductRepository'));
  });

  afterEach(() => {
    mockProductRepository = new MockProductRepository();
  });

  it('should create a product', async () => {
    const product = await productService.createProduct('SKU123', 'Product A', 100.0);
    expect(product).toBeDefined();
    expect(product.getId()).toBeDefined();
    expect(product.sku).toBe('SKU123');
    expect(product.name).toBe('Product A');
    expect(product.price).toBe(100.0);

    const savedProduct = await mockProductRepository.findById(product.getId());
    expect(savedProduct).toEqual(product);
  });

  it('should get a product by id', async () => {
    const product = await mockProductRepository.create(new Product('SKU456', 'Product B', 200.0));

    const fetchedProduct = await productService.getProductById(product.getId());
    expect(fetchedProduct).toBeDefined();
    expect(fetchedProduct!.getId()).toBe(product.getId());
    expect(fetchedProduct!.sku).toBe('SKU456');
    expect(fetchedProduct!.name).toBe('Product B');
    expect(fetchedProduct!.price).toBe(200.0);
  });

  it('should get all products', async () => {
    await mockProductRepository.create(new Product('SKU789', 'Product C', 300.0));
    await mockProductRepository.create(new Product('SKU999', 'Product D', 400.0));

    const products = await productService.getAllProducts();
    expect(products).toHaveLength(2);
    expect(products[0].sku).toBe('SKU789');
    expect(products[1].sku).toBe('SKU999');
  });

  it('should delete a product', async () => {
    const product = await mockProductRepository.create(new Product('SKU123', 'Product A', 100.0));

    await productService.deleteProduct(product.getId());
    const deletedProduct = await mockProductRepository.findById(product.getId());
    expect(deletedProduct).toBeNull();
  });

});

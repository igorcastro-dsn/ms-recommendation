
import { inject, injectable } from 'tsyringe';
import { IOrderRepository } from '../../domain/order/repositories/IOrderRepository';
import { Order } from '../../domain/order/entities/Order';
import { OrderItem } from '../../domain/order/entities/OrderItem';
import { sqs } from '../../infrastructure/config/sqs-client-config'
import logger from '../../infrastructure/config/logger-config';
import { IProductRepository } from '../../domain/product/repositories/IProductRepository';
import { Product } from '../../domain/product/entities/Product';
import { NotFoundError } from '../../domain/errors/NotFoundError';

@injectable()
export class OrderService {

  constructor(
    @inject('OrderRepository') private orderRepository: IOrderRepository,
    @inject('ProductRepository') private productRepository: IProductRepository,
  ) {}

  async createOrder(items: any[]): Promise<void> {
    logger.info(`Creating a new order...`);

    const productIds = items.map(item => item.productId);
    const products = await this.productRepository.findByIds(productIds);

    const missingProductIds = productIds.filter(id => !products.find(product => product.getId() === id));
    if (missingProductIds.length > 0) {
      throw new NotFoundError(`Product ids not found: ${missingProductIds.join(', ')}`);
    }

    const orderItems = this.mapOrderItems(products, items);
    const order = new Order(orderItems);
    const savedOrder = await this.orderRepository.create(order);
    
    logger.info('Order created successfully');

    await this.sendOrderCreatedEvent(savedOrder);
  }

  private async sendOrderCreatedEvent(order: Order) {
    logger.info(`Sending order created event for id ${order.getId()}`);
    await sqs.sendMessage({
      QueueUrl: `${process.env.AWS_HOST}/000000000000/${process.env.SQS_ORDER_CREATED_QUEUE}`,
      MessageBody: JSON.stringify({ 
        orderId: order.getId(), 
        items: order.getItems(), 
        createdAt: order.getCreatedAt() 
      }),
    }).promise();
  }

  private mapOrderItems(products: Product[], items: any[]): OrderItem[] {
    const productsMap = this.getAsHashMap(products);

    return items.map((item: any) => {
      const product = productsMap.get(item.productId);
      const price = product!.price || 0;
      return new OrderItem(item.productId, price, item.quantity)
    });
  }

  private getAsHashMap(products: Product[]): Map<string, Product> {
    return new Map(products.map((product: Product) => [product.getId(), product]));
  }
  
}

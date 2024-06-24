import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/OrderEntity';
import { IOrderRepository } from '../../../../domain/order/repositories/IOrderRepository';
import { Order } from '../../../../domain/order/entities/Order';
import { AppDataSource } from '../../../config/data-source-config';
import { OrderItem } from '../../../../domain/order/entities/OrderItem';

@injectable()
export class OrderRepository implements IOrderRepository {

  private repository: Repository<OrderEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(OrderEntity);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.repository.find({ relations: ['items'] });
    return orders.map(order => this.mapToDomain(order));
  }

  async create(order: Order): Promise<Order> {
    const orderEntity = this.repository.create({
      totalAmount: order.getTotalAmount(),
      items: order.getItems().map(item => ({
        id: item.getId(),
        productId: item.productId,
        unitPrice: item.unitPrice,
        quantity: item.quantity
      })),
      createdAt: order.getCreatedAt().toISOString()
    });

    const savedOrder = await this.repository.save(orderEntity);
    return this.mapToDomain(savedOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.repository.findOne({ where: { id: id} });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  private mapToDomain(entity: OrderEntity): Order {
    const order = new Order(entity.items.map(item => {
      const orderItem = new OrderItem(item.productId, item.unitPrice, item.quantity);
      orderItem.setId(item.id);
      return orderItem;
    }));
    order.setId(entity.id);
    return order;
  }

}

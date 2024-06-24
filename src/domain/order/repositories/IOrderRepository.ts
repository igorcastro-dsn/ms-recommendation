import { Order } from '../entities/Order';

export interface IOrderRepository {

  create(order: Order): Promise<Order>;

  findAll(): Promise<Order[]>;

  findById(id: string): Promise<Order | null>;

}

import { v4 as uuidv4 } from 'uuid';
import { Order } from '../../../domain/order/entities/Order';
import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';

export class MockOrderRepository implements IOrderRepository {
  
    private orders: Order[] = [];

    async create(order: Order): Promise<Order> {
        order.setId(uuidv4())
        this.orders.push(order);
        return order;
    }

    async findAll(): Promise<Order[]> {
        return this.orders;
    }
    
    async findById(id: string): Promise<Order | null> {
        return this.orders.find(o => o.getId() === id) || null;
    }
  
}
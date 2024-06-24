import { Entity } from '../../../domain/Entity';
import { OrderItem } from './OrderItem';

export class Order extends Entity {

  private items: OrderItem[];
  private totalAmount: number;
  private createdAt: Date;
  
  constructor(items: OrderItem[]) {
    super();
    this.items = items;
    this.createdAt = new Date();
    this.totalAmount = this.calculateTotal();
  }
  
  private calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }
  
  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

}

import { DateUtils } from '../../infrastructure/utils/DateUtils';
import { Order } from '../../domain/order/entities/Order'
import { OrderItem } from '../../domain/order/entities/OrderItem';

describe('Order', () => {
    
  it('calculates total amount correctly', () => {
    const items: OrderItem[] = [
      new OrderItem('Item 1', 10.27, 2),
      new OrderItem('Item 2', 20.66, 1)
    ];

    const order = new Order(items);

    expect(order.getTotalAmount()).toBe(41.2);
  });

  it('returns correct createdAt date', () => {
    const items: OrderItem[] = [
      new OrderItem('Item 1', 10, 2),
      new OrderItem('Item 2', 20, 1)
    ];

    const order = new Order(items);

    expect(order.getCreatedAt()).toBeInstanceOf(Date);

    const now = new Date();
    expect(DateUtils.toUtcDateOnly(order.getCreatedAt())).toStrictEqual(DateUtils.toUtcDateOnly(now))
  });

});

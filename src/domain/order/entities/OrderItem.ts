import { Entity } from '../../../domain/Entity';

export class OrderItem extends Entity {

  constructor(
    public productId: string,
    public unitPrice: number,
    public quantity: number
  ) {
    super();
  }
  
}

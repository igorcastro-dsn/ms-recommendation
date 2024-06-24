import { Entity } from '../../../domain/Entity';

export class Product extends Entity {
  
  constructor(
    public sku: string,
    public name: string,
    public price: number
  ) {
    super();
  }

}
  
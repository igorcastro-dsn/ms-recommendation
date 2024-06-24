import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { OrderService } from '../services/OrderService';
import logger from '../../infrastructure/config/logger-config';
import { NotFoundError } from '../../domain/errors/NotFoundError';

@injectable()
export class OrderController {

  constructor(
    @inject(OrderService) private orderService: OrderService
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    const { items } = req.body;
    try {
      await this.orderService.createOrder(items);
      res.status(201).send({ message: 'Order created successfully' });
    } catch (error: any) {
      logger.error(`Error creating a new order: ${error}`);
      if (error instanceof NotFoundError) {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error });
      }
    }
  }

}

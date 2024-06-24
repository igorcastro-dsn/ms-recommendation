import { Router } from 'express';
import { container } from 'tsyringe';
import { OrderController } from '../../application/controllers/OrderController';

const router = Router();
const orderController = container.resolve(OrderController);

router.post('/orders', (req, res) => orderController.createOrder(req, res));

export default router;

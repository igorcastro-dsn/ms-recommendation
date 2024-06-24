import request from 'supertest';
import { createProduct } from './utils';

describe('OrderController', () => {
  const BASE_URL = 'http://localhost:3002';

  it('should create a new order', async () => {

    const idProduct1 = await createProduct('12345', 'Product 1', 100);
    const idProduct2 = await createProduct('67890', 'Product 2', 200);

    const response = await request(BASE_URL)
      .post('/api/orders')
      .send({
        items: [
          { productId: idProduct1, quantity: 2 },
          { productId: idProduct2, quantity: 3 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Order created successfully');
  });

  it('should return 400 for not found error', async () => {
    const response = await request(BASE_URL)
      .post('/api/orders')
      .send({
        items: [
          { productId: 98765, quantity: 2 },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
 
});

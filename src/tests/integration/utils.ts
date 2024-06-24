import request from 'supertest';

const BASE_URL = 'http://localhost:3002';

export async function createProduct(sku: string, name: string, price: number): Promise<string> {
  const response = await request(BASE_URL)
    .post('/api/products')
    .send({ sku, name, price });

  if (response.status !== 201) {
    throw new Error(`Failed to create product: ${response.body.message}`);
  }

  return response.body.id;
}

export async function createOrder(items: { productId: string, quantity: number }[]): Promise<string> {
  const response = await request(BASE_URL)
    .post('/api/orders')
    .send({ items });

  if (response.status !== 201) {
    throw new Error(`Failed to create order: ${response.body.message}`);
  }

  return response.body.id;
}

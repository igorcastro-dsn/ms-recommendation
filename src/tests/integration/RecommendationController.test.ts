import request from 'supertest';
import { createProduct, createOrder } from './utils';
import { DateUtils } from '../../infrastructure/utils/DateUtils';

jest.setTimeout(10000);

describe('RecommendationController', () => {
  const BASE_URL = 'http://localhost:3002';

  let product1Id: string;
  let product2Id: string;
  let product3Id: string;

  beforeAll(async () => {
    product1Id = await createProduct('SKU-12345', 'Product 1', 100);
    product2Id = await createProduct('SKU-67890', 'Product 2', 200);
    product3Id = await createProduct('SKU-11121', 'Product 3', 300);

    await createOrder([
      { productId: product1Id, quantity: 1 },
      { productId: product2Id, quantity: 1 },
      { productId: product3Id, quantity: 1 },
    ]);

  });

  it('should get recommendations for a product', async () => {
    const startDate = '2023-01-01';
    const endDate = DateUtils.getCurrentDateString();

     // TODO: Débito técnico - Deixar teste mais dinâmico em relação ao consumo da fila ao invés de aguardar tempo fixo
    await new Promise(resolve => setTimeout(resolve, 5000));

    const response = await request(BASE_URL)
      .get(`/api/products/${product1Id}/recommendations`)
      .query({ startDate, endDate });

    expect(response.status).toBe(200);
    const body = response.body;
    expect(Array.isArray(body.recommendations)).toBe(true);
    expect(body.recommendations.length > 0).toBeTruthy();
    expect(body.recommendations[0].score).toBe(0.5);
    expect(body.recommendations[1].score).toBe(0.5);
  });

  it('should return 400 if startDate or endDate are missing', async () => {
    const response = await request(BASE_URL)
      .get(`/api/products/${product1Id}/recommendations`)
      .query({ startDate: '2023-01-01' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Params startDate and endDate are required');
  });

  it('should return 400 for invalid date format', async () => {
    const response = await request(BASE_URL)
      .get(`/api/products/${product1Id}/recommendations`)
      .query({ startDate: 'invalid-date', endDate: '2023-12-31' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid format for params startDate or endDate. Use YYYY-MM-DD) format');
  });

});

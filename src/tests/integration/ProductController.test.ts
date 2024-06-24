import request from 'supertest';

describe('ProductController', () => {

  const BASE_URL = 'http://localhost:3002';

  it('should create a new product', async () => {
    const response = await request(BASE_URL)
      .post('/api/products')
      .send({
        sku: '12345',
        name: 'Product 1',
        price: 100,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Product 1');
  });

  it('should get a product by id', async () => {
    const createResponse = await request(BASE_URL)
      .post('/api/products')
      .send({
        sku: '12346',
        name: 'Product 2',
        price: 200,
      });

    const productId = createResponse.body.id;

    const response = await request(BASE_URL).get(`/api/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });

  it('should delete a product by id', async () => {
    const createResponse = await request(BASE_URL)
      .post('/api/products')
      .send({
        sku: '12347',
        name: 'Product 3',
        price: 300,
      });

    const productId = createResponse.body.id;

    const response = await request(BASE_URL).delete(`/api/products/${productId}`);

    expect(response.status).toBe(204);
  });

  it('should get all products', async () => {
    const response = await request(BASE_URL).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

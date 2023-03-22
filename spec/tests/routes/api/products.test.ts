import request from 'supertest';
import express from 'express';
import client from '../../../../src/database';
import { User } from '../../../../src/models/user';

import { createTestUser, authenticateTestUser, clearTestTables } from '../../utils/utils';
import routes from '../../../../src/routes/index';

const app = express();
app.use(express.json());
app.use('/', routes);

let user: User;
let token: string;

beforeAll(async () => {
  user = await createTestUser(app);
  token = await authenticateTestUser(app, user);
});

describe('Products API', () => {
  it('should create a new product', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 999,
      category: 'test'
    };
    const response = await request(app).post('/products').send(newProduct).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Product');
  });

  it('should return all products', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return a specific product', async () => {
    const allProductsResponse = await request(app).get('/products');
    const firstProduct = allProductsResponse.body[0];

    const response = await request(app).get('/products/' + firstProduct.id);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(firstProduct.id);
  });

  it('should 400 when trying to create a product with no name', async () => {
    const newProduct = {
      price: 999,
      category: 'test'
    };
    const response = await request(app).post('/products').send(newProduct).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should 400 when trying to create a product with no price', async () => {
    const newProduct = {
      name: 'Test Product',
      category: 'test'
    };
    const response = await request(app).post('/products').send(newProduct).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should 500 when the product does not exist', async () => {
    const response = await request(app).get('/products/' + 'invalid-id');

    expect(response.status).toBe(500);
  });
});

afterAll(async () => {
  await clearTestTables();
  await client.end();
});

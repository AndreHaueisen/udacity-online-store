import request from 'supertest';
import express from 'express';
import client from '../../../../src/database';
import { User } from '../../../../src/models/user';

import { createTestUser, authenticateTestUser, clearTestTables, createTestProduct } from '../../utils/utils';
import routes from '../../../../src/routes/index';

const app = express();
app.use(express.json());
app.use('/', routes);

let user: User;
let token: string;

beforeAll(async () => {
  user = await createTestUser(app);
  token = await authenticateTestUser(app, user);
  await createTestProduct(app, token);
});

describe('Orders API', () => {
  it('should create a new order', async () => {
    const newOrder = {
      userId: user.id
    };
    const response = await request(app).post('/orders').send(newOrder).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.status).toBe('active');
  });

  it('should return all orders', async () => {
    const response = await request(app).get('/orders').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return a specific order', async () => {
    const allOrdersResponse = await request(app).get('/orders').set('Authorization', `Bearer ${token}`);
    const firstOrder = allOrdersResponse.body[0];

    const response = await request(app)
      .get('/orders/' + firstOrder.id)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(firstOrder.id);
  });

  it("should return the user's current order", async () => {
    const response = await request(app).get(`/orders/currentOrder/${user.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.status).toBe('active');
  });

  it('should mark an order as complete', async () => {
    const allOrdersResponse = await request(app).get('/orders').set('Authorization', `Bearer ${token}`);
    const firstOrder = allOrdersResponse.body[0];

    const response = await request(app)
      .put(`/orders/${firstOrder.id}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('complete');
  });

  it('should return all complete orders', async () => {
    const response = await request(app)
      .get(`/orders/completedOrders/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should add a product to an existing order', async () => {
    const allOrdersResponse = await request(app).get('/orders').set('Authorization', `Bearer ${token}`);
    const firstOrder = allOrdersResponse.body[0];

    const allProductsResponse = await request(app).get('/products');
    const firstProduct = allProductsResponse.body[0];

    const productInput = {
      productId: firstProduct.id,
      productQuantity: 2
    };

    const response = await request(app)
      .post(`/orders/${firstOrder.id}/addProduct`)
      .send(productInput)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.orderId).toBe(firstOrder.id);
    expect(response.body.productId).toBe(firstProduct.id);
    expect(response.body.quantity).toBe(2);
  });

  it('should 400 when trying to create an order with no user id', async () => {
    const newOrder = {
      userId: null
    };
    const response = await request(app).post('/orders').send(newOrder).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should 400 when tring to add a product that does not exist to an order', async () => {
    const allOrdersResponse = await request(app).get('/orders').set('Authorization', `Bearer ${token}`);
    const firstOrder = allOrdersResponse.body[0];

    const productInput = {
      productId: 999,
      productQuantity: 2
    };

    const response = await request(app)
      .post(`/orders/${firstOrder.id}/addProduct`)
      .send(productInput)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  await clearTestTables();
  await client.end();
});

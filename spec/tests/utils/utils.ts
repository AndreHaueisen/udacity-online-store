import client from '../../../src/database';
import request from 'supertest';
import express from 'express';

export async function clearTestTables(): Promise<void> {
  await client.query('DELETE FROM product_order');
  await client.query('DELETE FROM orders');
  await client.query('DELETE FROM users');
  await client.query('DELETE FROM products');
}

export async function createTestUser(app: express.Application): Promise<string> {
  const newUser = {
    firstName: 'John',
    lastName: 'Doe',
    password: 'testpassword'
  };
  const response = await request(app).post('/users').send(newUser);

  expect(response.status).toBe(200);

  return response.body;
}

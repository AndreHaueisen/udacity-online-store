import client from '../../../src/database';
import { User } from '../../../src/models/user';
import { Product } from '../../../src/models/product';
import request from 'supertest';
import express from 'express';

export async function clearTestTables(): Promise<void> {
  await client.query('DELETE FROM product_order');
  await client.query('DELETE FROM orders');
  await client.query('DELETE FROM users');
  await client.query('DELETE FROM products');
}

export async function createTestUser(app: express.Application): Promise<User> {
  const newUser = {
    firstName: 'John',
    lastName: 'Doe',
    password: 'testpassword'
  };
  const response = await request(app).post('/users').send(newUser);

  expect(response.status).toBe(200);

  return response.body;
}

export async function authenticateTestUser(app: express.Application, user: User): Promise<string> {
  const authenticationInput = {
    id: user.id,
    password: 'testpassword'
  };

  const response = await request(app).post('/users/authenticate').send(authenticationInput);

  expect(response.status).toBe(200);
  expect(typeof response.body).toBe('string');

  return response.body;
}

export async function createTestProduct(app: express.Application, token: string): Promise<Product> {
  const newProduct = {
    name: 'Test Product',
    price: 999,
    category: 'test'
  };
  const response = await request(app).post('/products').send(newProduct).set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);

  return response.body;
}

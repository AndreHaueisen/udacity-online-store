import request from 'supertest';
import express from 'express';
import client from '../../../../src/database';

import { clearTestTables } from '../../utils/utils';
import routes from '../../../../src/routes/index';
import { User } from '../../../../src/models/user';

const app = express();
app.use(express.json());
app.use('/', routes);

describe('Users API', () => {
  let user: User;
  let token: string;

  it('should create a new user', async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      password: 'password'
    };
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(200);
    user = response.body;
  });

  it('should create another user', async () => {
    const newUser = {
      firstName: 'Another Test',
      lastName: 'User',
      password: 'password'
    };
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(200);
  });

  it('should authenticate a user', async () => {
    const authenticationInput = {
      id: user.id,
      password: 'password'
    };

    const response = await request(app).post('/users/authenticate').send(authenticationInput);

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('string');
    token = response.body;
  });

  it('should return all users', async () => {
    const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('should return a specific user', async () => {
    const response = await request(app)
      .get('/users/' + user.id)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(user.id);
  });

  afterAll(async () => {
    await clearTestTables();
    await client.end();
  });

  it('should 400 when trying to authenticate a user with no id', async () => {
    const authenticationInput = {
      password: 'password'
    };

    const response = await request(app).post('/users/authenticate').send(authenticationInput);

    expect(response.status).toBe(400);
  });

  it('should 400 when trying to authenticate a user with no password', async () => {
    const authenticationInput = {
      id: user.id
    };

    const response = await request(app).post('/users/authenticate').send(authenticationInput);

    expect(response.status).toBe(400);
  });

  it('should 401 when trying to authenticate a user with an incorrect password', async () => {
    const authenticationInput = {
      id: user.id,
      password: 'incorrect'
    };

    const response = await request(app).post('/users/authenticate').send(authenticationInput);

    expect(response.status).toBe(401);
  });

  it('should 400 when trying to create a user with no first name', async () => {
    const newUser = {
      lastName: 'User',
      password: 'password'
    };
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(400);
  });

  it('should 400 when trying to create a user with no last name', async () => {
    const newUser = {
      firstName: 'Test',
      password: 'password'
    };
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(400);
  });

  it('should 400 when trying to create a user with no password', async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User'
    };
    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(400);
  });
});

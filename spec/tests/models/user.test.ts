import client from '../../../src/database';
import { UserStore, User } from '../../../src/models/user';

const store = new UserStore(10, 'pepper');

describe('User model', () => {
  test('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  test('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  test('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  test('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  test('create should add a user', async () => {
    const userInput = {
      firstName: 'John',
      lastName: 'Doe',
      password: 'password'
    };

    const userInput2 = {
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'password'
    };

    const result = await store.create(userInput);
    const result2 = await store.create(userInput2);

    expect(result).toEqual(new User(result.id, 'John', 'Doe', result.password));
    expect(result2).toEqual(new User(result2.id, 'Jane', 'Doe', result2.password));
  });

  test('index should return all the users', async () => {
    const result = await store.index();

    expect(result.length).toBe(2);
    const firstUser = result[0];
    const secondUser = result[1];

    expect(firstUser).toEqual(new User(firstUser.id, 'John', 'Doe', firstUser.password));
    expect(secondUser).toEqual(new User(secondUser.id, 'Jane', 'Doe', secondUser.password));
  });

  test('show should return the correct user', async () => {
    const users = await store.index();
    const firstUser = users[0];

    const result = await store.show(firstUser.id);

    expect(result).toEqual(new User(result.id, 'John', 'Doe', result.password));
    expect(result).toEqual(firstUser);
  });

  test('authenticate should return a user if the password is correct', async () => {
    const users = await store.index();
    const firstUser = users[0];

    const result = await store.authenticate(firstUser.id, 'password');
    expect(result).toEqual(new User(firstUser.id, 'John', 'Doe', firstUser.password));
  });

  test('authenticate should throw an error if the password is incorrect', async () => {
    const users = await store.index();
    const firstUser = users[0];

    const result = await store.authenticate(firstUser.id, 'wrongpassword');
    expect(result).toBeNull();
  });

  afterAll(async () => {
    await client.end();
  });
});

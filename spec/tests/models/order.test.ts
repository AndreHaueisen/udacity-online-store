import { OrderStore, Order, OrderStatus } from '../../../src/models/order';
import { UserStore, User } from '../../../src/models/user';
import client from '../../../src/database';

const userStore = new UserStore(10, 'pepper');
const store = new OrderStore();

beforeAll(async () => {
  await createFakeUser();
});

async function createFakeUser(): Promise<void> {
  const fakeUser = {
    firstName: 'John',
    lastName: 'Doe',
    password: 'password'
  };

  await userStore.create(fakeUser);
}

describe('Order Model', () => {
  test('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  test('shoud have a show method', () => {
    expect(store.show).toBeDefined();
  });

  test('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  test('should have a update method', () => {
    expect(store.addProduct).toBeDefined();
  });

  test('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  test('create should add an order', async () => {
    const fakeUser = await getFakeUser();

    const order1 = {
      productsIds: ['1'],
      productsQuantities: [2],
      userId: fakeUser.id
    };

    const order2 = {
      productsIds: ['abc', 'def'],
      productsQuantities: [1, 1],
      userId: fakeUser.id
    };

    const result1 = await store.create(order1);
    const result2 = await store.create(order2);

    expect(result1).toEqual(
      new Order(result1.id, order1.productsIds, order1.productsQuantities, order1.userId, result1.status)
    );
    expect(result2).toEqual(
      new Order(result2.id, order2.productsIds, order2.productsQuantities, order2.userId, result2.status)
    );
  });

  test('index should return all the orders', async () => {
    const fakeUser = await getFakeUser();
    const result = await store.index();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(new Order(result[0].id, ['1'], [2], fakeUser.id, OrderStatus.active));
    expect(result[1]).toEqual(new Order(result[1].id, ['abc', 'def'], [1, 1], fakeUser.id, OrderStatus.active));
  });

  test('show should return the correct order', async () => {
    const fakeUser = await getFakeUser();
    const result = await store.index();

    const order1 = await store.show(result[0].id);
    const order2 = await store.show(result[1].id);

    expect(order1).toEqual(new Order(order1.id, ['1'], [2], fakeUser.id, OrderStatus.active));
    expect(order2).toEqual(new Order(order2.id, ['abc', 'def'], [1, 1], fakeUser.id, OrderStatus.active));
  });

  test('show should throw an error if the order does not exist', async () => {
    try {
      await store.show('123');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  test('addProduct should add a product to an order', async () => {
    const fakeUser = await getFakeUser();
    const result = await store.index();

    const addProductInput1 = {
      productId: '4',
      productQuantity: 5
    };

    const addProductInput2 = {
      productId: '5',
      productQuantity: 1
    };

    const updatedOrder1 = await store.addProduct(result[0].id, addProductInput1);

    expect(updatedOrder1).toEqual(new Order(updatedOrder1.id, ['1', '4'], [2, 5], fakeUser.id, OrderStatus.active));

    const updatedOrder2 = await store.addProduct(result[0].id, addProductInput2);

    expect(updatedOrder2).toEqual(
      new Order(updatedOrder2.id, ['1', '4', '5'], [2, 5, 1], fakeUser.id, OrderStatus.active)
    );
  });

  test('delete should delete an order', async () => {
    const result = await store.index();
    const firstOrder = await store.show(result[0].id);

    const deletedOrder = await store.delete(firstOrder.id);

    expect(deletedOrder).toEqual(
      new Order(
        firstOrder.id,
        firstOrder.productsIds,
        firstOrder.productsQuantities,
        firstOrder.userId,
        firstOrder.status
      )
    );

    const orders = await store.index();

    expect(orders.length).toBe(1);
  });

  test('delete should throw an error if the order does not exist', async () => {
    try {
      await store.delete('123');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  afterAll(async () => {
    await client.end();
  });
});

async function getFakeUser(): Promise<User> {
  const users = await userStore.index();
  return users[0];
}

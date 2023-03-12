import { OrderStore, Order, OrderStatus, ProductOrder } from '../../../src/models/order';
import { UserStore, User } from '../../../src/models/user';
import { ProductStore } from '../../../src/models/product';
import client from '../../../src/database';

const userStore = new UserStore(10, 'pepper');
const productStore = new ProductStore();
const store = new OrderStore();

beforeAll(async () => {
  await createFakeUser();
  await createFakeProduct();
});

async function createFakeUser(): Promise<void> {
  const fakeUser = {
    firstName: 'John',
    lastName: 'Doe',
    password: 'password'
  };

  await userStore.create(fakeUser);
}

async function createFakeProduct(): Promise<void> {
  const fakeProduct = {
    name: 'test product',
    price: 1000,
    category: 'test'
  };

  await productStore.create(fakeProduct);
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

  test('create should add an order', async () => {
    const fakeUser = await getFakeUser();

    const order1 = {
      userId: fakeUser.id
    };

    const order2 = {
      userId: fakeUser.id
    };

    const result1 = await store.create(order1);
    const result2 = await store.create(order2);

    expect(result1).toEqual(new Order(result1.id, result1.createdAt, order1.userId, result1.status));
    expect(result2).toEqual(new Order(result2.id, result2.createdAt, order2.userId, result2.status));
  });

  test('index should return all the orders sorted by created_at descending', async () => {
    const fakeUser = await getFakeUser();
    const result = await store.index();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(new Order(result[0].id, result[0].createdAt, fakeUser.id, OrderStatus.active));
    expect(result[1]).toEqual(new Order(result[1].id, result[1].createdAt, fakeUser.id, OrderStatus.active));
  });

  test('show should return the correct order', async () => {
    const fakeUser = await getFakeUser();
    const result = await store.index();

    const order1 = await store.show(result[0].id);
    const order2 = await store.show(result[1].id);

    expect(order1).toEqual(new Order(order1.id, order1.createdAt, fakeUser.id, OrderStatus.active));
    expect(order2).toEqual(new Order(order2.id, order2.createdAt, fakeUser.id, OrderStatus.active));
  });

  test('show should throw an error if the order does not exist', async () => {
    try {
      await store.show('123');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  test('addProduct should add a product to the product_order table', async () => {
    const result = await store.index();
    const order1 = await store.show(result[0].id);
    const product1 = (await productStore.index())[0];

    const addProductInput1 = {
      productId: product1.id,
      productQuantity: 5
    };

    const addProductInput2 = {
      productId: product1.id,
      productQuantity: 1
    };

    const productOrder1 = await store.addProduct(order1.id, addProductInput1);
    expect(productOrder1).toEqual(new ProductOrder(productOrder1.id, order1.id, product1.id, 5));

    const productOrder2 = await store.addProduct(order1.id, addProductInput2);
    expect(productOrder2).toEqual(new ProductOrder(productOrder2.id, order1.id, product1.id, 1));
  });

  test('completeOrder should change the status of an order to complete', async () => {
    const result = await store.index();

    const completedOrder = await store.completeOrder(result[0].id);
    const updatedOrder = await store.show(result[0].id);

    expect(completedOrder).toEqual(
      new Order(updatedOrder.id, updatedOrder.createdAt, updatedOrder.userId, OrderStatus.complete)
    );
  });

  test('userCompletedOrders should return all the completed orders of a user', async () => {
    const fakeUser = await getFakeUser();

    const completedOrders = await store.userCompletedOrders(fakeUser.id);
    const updatedOrder = await store.show(completedOrders[0].id);

    expect(completedOrders.length).toBe(1);
    expect(completedOrders[0]).toEqual(
      new Order(updatedOrder.id, updatedOrder.createdAt, fakeUser.id, OrderStatus.complete)
    );
  });

  test('currentUserOrder should return the most recent order of a user', async () => {
    const fakeUser = await getFakeUser();

    const orders = await store.index();
    const lastOrder = await store.currentUserOrder(fakeUser.id);

    expect(lastOrder).toEqual(orders[1]);
  });

  afterAll(async () => {
    await clearTables();
    await client.end();
  });
});

async function getFakeUser(): Promise<User> {
  const users = await userStore.index();
  return users[0];
}

async function clearTables(): Promise<void> {
  await client.query('DELETE FROM product_order');
  await client.query('DELETE FROM orders');
  await client.query('DELETE FROM users');
  await client.query('DELETE FROM products');
}

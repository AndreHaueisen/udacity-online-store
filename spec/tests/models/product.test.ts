import client from '../../../src/database';
import { ProductStore, Product } from '../../../src/models/product';
import { clearTestTables } from '../utils/utils';

const store = new ProductStore();

describe('Product Model', () => {
  test('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  test('shoud have a show method', () => {
    expect(store.show).toBeDefined();
  });

  test('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  test('create should add a product', async () => {
    const result1 = await store.create({
      name: 'Fake 1',
      price: 1000,
      category: 'Category One'
    });

    const result2 = await store.create({
      name: 'Fake 2',
      price: 2000,
      category: 'Category Two'
    });

    const result3 = await store.create({
      name: 'Fake 3',
      price: 3000,
      category: 'Category One'
    });

    expect(result1).toEqual(new Product(result1.id, 'Fake 1', 1000, 'Category One'));
    expect(result2).toEqual(new Product(result2.id, 'Fake 2', 2000, 'Category Two'));
    expect(result3).toEqual(new Product(result3.id, 'Fake 3', 3000, 'Category One'));
  });

  test('index should return all the products', async () => {
    const result = await store.index();

    expect(result.length).toBe(3);
    expect(result[0]).toEqual(new Product(result[0].id, 'Fake 1', 1000, 'Category One'));
    expect(result[1]).toEqual(new Product(result[1].id, 'Fake 2', 2000, 'Category Two'));
    expect(result[2]).toEqual(new Product(result[2].id, 'Fake 3', 3000, 'Category One'));
  });

  test('show should return the correct product', async () => {
    const result = await store.index();

    const product1 = await store.show(result[0].id);
    const product2 = await store.show(result[1].id);
    const product3 = await store.show(result[2].id);

    expect(product1).toEqual(new Product(product1.id, 'Fake 1', 1000, 'Category One'));
    expect(product2).toEqual(new Product(product2.id, 'Fake 2', 2000, 'Category Two'));
    expect(product3).toEqual(new Product(product3.id, 'Fake 3', 3000, 'Category One'));
  });

  test('show should throw an error if the product does not exist', async () => {
    try {
      await store.show('123');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  test('show should throw an error if the product id is invalid', async () => {
    try {
      await store.show('invalid');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  test('byCategory should return all the products in a category', async () => {
    const result = await store.byCategory('Category One');

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(new Product(result[0].id, 'Fake 1', 1000, 'Category One'));
    expect(result[1]).toEqual(new Product(result[1].id, 'Fake 3', 3000, 'Category One'));
  });

  afterAll(async () => {
    await clearTestTables();
    await client.end();
  });
});

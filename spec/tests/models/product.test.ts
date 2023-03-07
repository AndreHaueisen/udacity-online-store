import { ProductStore, Product } from '../../../src/models/product';

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
      name: 'Fake One',
      price: 1000,
      category: 'Category Two'
    });

    const result2 = await store.create({
      name: 'Fake Two',
      price: 2000,
      category: 'Category Two'
    });

    expect(result1).toEqual(new Product(result1.id, 'Fake One', 1000, 'Category Two'));
    expect(result2).toEqual(new Product(result2.id, 'Fake Two', 2000, 'Category Two'));
  });

  test('index should return all the products', async () => {
    const result = await store.index();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(new Product(result[0].id, 'Fake One', 1000, 'Category Two'));
    expect(result[1]).toEqual(new Product(result[1].id, 'Fake Two', 2000, 'Category Two'));
  });

  test('show should return the correct product', async () => {
    const result = await store.index();

    const product1 = await store.show(result[0].id);
    const product2 = await store.show(result[1].id);

    expect(product1).toEqual(new Product(product1.id, 'Fake One', 1000, 'Category Two'));
    expect(product2).toEqual(new Product(product2.id, 'Fake Two', 2000, 'Category Two'));
  });

  test('show should throw an error if the product does not exist', async () => {
    expect(() => {
      store.show('123');
    }).toThrowError('Unable to get product 123: Error: Product not found');
  });
});

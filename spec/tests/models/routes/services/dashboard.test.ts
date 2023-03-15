import { ProductStore } from '../../../../../src/models/product';
import { OrderStore } from '../../../../../src/models/order';
import { UserStore } from '../../../../../src/models/user';
import { DashboardQueries } from '../../../../../src/routes/services/dashboard';
import { clearTestTables } from '../../../utils/utils';
import client from '../../../../../src/database';

const productStore = new ProductStore();
const orderStore = new OrderStore();
const userStore = new UserStore(10, 'pepper');
const dashboard = new DashboardQueries();

beforeAll(async () => {
  await createFakeProducts();
  await createFakeUser();
  await createFakeOrders();
  await createFakeProductOrders();
});

// creates six products
async function createFakeProducts(): Promise<void> {
  const fakeProducts = [
    {
      name: 'test product 1',
      price: 1000,
      category: 'test'
    },
    {
      name: 'test product 2',
      price: 1000,
      category: 'test'
    },
    {
      name: 'test product 3',
      price: 1000,
      category: 'test'
    },
    {
      name: 'test product 4',
      price: 1000,
      category: 'test'
    },
    {
      name: 'test product 5',
      price: 1000,
      category: 'test'
    },
    {
      name: 'test product 6',
      price: 1000,
      category: 'test'
    }
  ];

  for (const product of fakeProducts) {
    await productStore.create(product);
  }
}

async function createFakeUser(): Promise<void> {
  const fakeUser = {
    firstName: 'John',
    lastName: 'Doe',
    password: 'password'
  };

  await userStore.create(fakeUser);
}

// creates three fake orders
async function createFakeOrders(): Promise<void> {
  const fakeUsers = await userStore.index();
  const fakeUser = fakeUsers[0];

  const fakeOrders = [
    {
      userId: fakeUser.id
    },
    {
      userId: fakeUser.id
    },
    {
      userId: fakeUser.id
    }
  ];

  for (const order of fakeOrders) {
    await orderStore.create(order);
  }
}

// creates fake product orders
async function createFakeProductOrders(): Promise<void> {
  const fakeProducts = await productStore.index();
  const fakeOrders = await orderStore.index();

  console.log('fakeProducts', fakeProducts);

  const fakeProductOrders = [
    {
      productId: fakeProducts[0].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[0].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[0].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[0].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[0].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[0].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[1].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[1].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[2].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[2].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[3].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[3].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[3].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[4].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[4].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[4].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[4].id,
      productQuantity: 1
    },
    {
      productId: fakeProducts[5].id,
      productQuantity: 1
    }
  ];

  orderStore.addProduct(fakeOrders[0].id, fakeProductOrders[0]);
  orderStore.addProduct(fakeOrders[0].id, fakeProductOrders[1]);
  orderStore.addProduct(fakeOrders[0].id, fakeProductOrders[2]);
  orderStore.addProduct(fakeOrders[0].id, fakeProductOrders[3]);
  orderStore.addProduct(fakeOrders[0].id, fakeProductOrders[4]);
  orderStore.addProduct(fakeOrders[1].id, fakeProductOrders[5]);
  orderStore.addProduct(fakeOrders[1].id, fakeProductOrders[6]);
  orderStore.addProduct(fakeOrders[1].id, fakeProductOrders[7]);
  orderStore.addProduct(fakeOrders[1].id, fakeProductOrders[8]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[9]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[10]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[11]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[12]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[13]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[14]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[15]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[16]);
  orderStore.addProduct(fakeOrders[2].id, fakeProductOrders[17]);
}

describe('DashboardQueries', () => {
  test('should return the top five selling products', async () => {
    const topProducts = await dashboard.getTopFiveSellingProducts();

    console.log('topProducts', topProducts);

    expect(topProducts.length).toEqual(5);
    expect(topProducts[0].name).toEqual('test product 1');
    expect(topProducts[1].name).toEqual('test product 4');
    expect(topProducts[2].name).toEqual('test product 3');
    expect(topProducts[3].name).toEqual('test product 2');
  });

  afterAll(async () => {
    await clearTestTables();
    await client.end();
  });
});

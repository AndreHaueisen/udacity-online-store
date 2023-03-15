import client from '../../../src/database';

export async function clearTestTables(): Promise<void> {
  await client.query('DELETE FROM product_order');
  await client.query('DELETE FROM orders');
  await client.query('DELETE FROM users');
  await client.query('DELETE FROM products');
}

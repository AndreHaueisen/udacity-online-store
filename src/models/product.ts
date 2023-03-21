import { Store } from './store';

export class Product {
  constructor(
    readonly id: string,
    readonly name: string,
    /// The price of the product in cents
    readonly price: number,
    readonly category: string | null
  ) {}

  static fromRow(row: ProductRow): Product {
    return new Product(row.id, row.name, row.price, row.category);
  }
}

interface ProductRow {
  id: string;
  name: string;
  price: number;
  category: string | null;
}

export type ProductInput = {
  name: string;
  price: number;
  category: string | null;
};

export function isProductInput(body: unknown): body is ProductInput {
  return (
    typeof body === 'object' &&
    body !== null &&
    'name' in body &&
    typeof body.name === 'string' &&
    'price' in body &&
    typeof body.price === 'number' &&
    ('category' in body ? typeof body.category === 'string' || body.category === null : true)
  );
}

export class ProductStore extends Store {
  // returns all products ordered by name
  async index(): Promise<Product[]> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM products ORDER BY name';
      const result = await conn.query(sql);

      return result.rows.map(Product.fromRow);
    } catch (err) {
      throw new Error(`Unable to get products: ${err}`);
    } finally {
      conn.release();
    }
  }

  async show(id: string): Promise<Product> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Product ${id} not found`);
      }

      return Product.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to get product ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  async create(productInput: ProductInput): Promise<Product> {
    const conn = await super.connectToDB();

    try {
      const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [productInput.name, productInput.price, productInput.category]);

      const newProduct = result.rows[0];
      return Product.fromRow(newProduct);
    } catch (err) {
      throw new Error(`Unable to create product: ${err}`);
    } finally {
      conn.release();
    }
  }

  async byCategory(category: string): Promise<Product[]> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const result = await conn.query(sql, [category]);

      return result.rows.map(Product.fromRow);
    } catch {
      throw new Error(`Unable to get products in category ${category}`);
    } finally {
      conn.release();
    }
  }
}

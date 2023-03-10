import { Store } from './store';

export class Order {
  constructor(
    readonly id: string,
    readonly productsIds: string[],
    readonly productsQuantities: number[],
    readonly userId: string,
    readonly status: OrderStatus
  ) {}

  static fromRow(row: OrderRow): Order {
    const status = OrderStatus[row.status as keyof typeof OrderStatus];
    return new Order(row.id, row.products_ids, row.products_quantities, row.user_id, status);
  }
}

interface OrderRow {
  id: string;
  products_ids: string[];
  products_quantities: number[];
  user_id: string;
  status: OrderStatus;
}

export enum OrderStatus {
  active = 'active',
  cancelled = 'cancelled',
  complete = 'complete'
}

export type CreateOrderInput = {
  productsIds: string[];
  productsQuantities: number[];
  userId: string;
};

export type AddProductInput = {
  productId: string;
  productQuantity: number;
};

export class OrderStore extends Store {
  async index(): Promise<Order[]> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);

      return result.rows.map(Order.fromRow);
    } catch (err) {
      throw new Error(`Unable to get orders: ${err}`);
    } finally {
      conn.release();
    }
  }

  async show(id: string): Promise<Order> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Order ${id} not found`);
      }

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to get order ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    const conn = await super.connectToDB();

    try {
      const sql =
        'INSERT INTO orders (products_ids, products_quantities, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [
        createOrderInput.productsIds,
        createOrderInput.productsQuantities,
        createOrderInput.userId,
        OrderStatus.active
      ]);

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to create order: ${err}`);
    } finally {
      conn.release();
    }
  }

  async addProduct(id: string, addOrderInput: AddProductInput): Promise<Order> {
    const conn = await super.connectToDB();

    try {
      const order = await this.show(id);
      const sql =
        'UPDATE orders SET products_ids=($1), products_quantities=($2), status=($3) WHERE id=($4) RETURNING *';
      order.productsIds.push(addOrderInput.productId);
      order.productsQuantities.push(addOrderInput.productQuantity);

      const result = await conn.query(sql, [order.productsIds, order.productsQuantities, order.status, id]);

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to add product to order ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  async delete(id: string): Promise<Order> {
    const conn = await super.connectToDB();

    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Order ${id} not found`);
      }

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to delete order ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  async lastUserOrder(userId: string): Promise<Order> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) ORDER BY id DESC LIMIT 1';
      const result = await conn.query(sql, [userId]);

      if (result.rows.length === 0) {
        throw new Error(`This user has no orders`);
      }

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to get orders for user ${userId}: ${err}`);
    } finally {
      conn.release();
    }
  }
}

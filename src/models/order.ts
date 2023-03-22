import { Store } from './store';

// Order ----------------------------------------------------------------------

export class Order {
  constructor(readonly id: string, readonly createdAt: Date, readonly userId: string, readonly status: OrderStatus) {}

  static fromRow(row: OrderRow): Order {
    const status = OrderStatus[row.status as keyof typeof OrderStatus];
    return new Order(row.id, row.created_at, row.user_id, status);
  }
}

interface OrderRow {
  id: string;
  created_at: Date;
  user_id: string;
  status: OrderStatus;
}

export enum OrderStatus {
  active = 'active',
  cancelled = 'cancelled',
  complete = 'complete'
}

export type CreateOrderInput = {
  userId: string;
};

export function isCreateOrderInput(body: unknown): body is CreateOrderInput {
  return typeof body === 'object' && body !== null && 'userId' in body && typeof body.userId === 'string';
}

// ProductOrder ----------------------------------------------------------------

export class ProductOrder {
  constructor(readonly id: string, readonly orderId: string, readonly productId: string, readonly quantity: number) {}

  static fromRow(row: ProductOrderRow): ProductOrder {
    return new ProductOrder(row.id, row.order_id, row.product_id, row.quantity);
  }
}

interface ProductOrderRow {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
}

export type AddProductInput = {
  productId: string;
  productQuantity: number;
};

export function isAddProductInput(body: unknown): body is AddProductInput {
  return (
    typeof body === 'object' &&
    body !== null &&
    'productId' in body &&
    typeof body.productId === 'string' &&
    'productQuantity' in body &&
    typeof body.productQuantity === 'number'
  );
}

export class OrderStore extends Store {
  async index(): Promise<Order[]> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM orders ORDER BY created_at ASC';
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
      const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [createOrderInput.userId, OrderStatus.active]);

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to create order: ${err}`);
    } finally {
      conn.release();
    }
  }

  async addProduct(id: string, addProductInput: AddProductInput): Promise<ProductOrder> {
    const conn = await super.connectToDB();

    try {
      const sql = 'INSERT INTO product_order (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [id, addProductInput.productId, addProductInput.productQuantity]);

      return ProductOrder.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to add product to order ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  async currentUserOrder(userId: string): Promise<Order> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) ORDER BY created_at DESC LIMIT 1';
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

  async completeOrder(id: string): Promise<Order> {
    const conn = await super.connectToDB();

    try {
      const sql = 'UPDATE orders SET status=($1) WHERE id=($2) RETURNING *';
      const result = await conn.query(sql, [OrderStatus.complete, id]);

      if (result.rows.length === 0) {
        throw new Error(`Order ${id} not found`);
      }

      return Order.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to complete order ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }

  async userCompletedOrders(userId: string): Promise<Order[]> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const result = await conn.query(sql, [userId, OrderStatus.complete]);

      return result.rows.map(Order.fromRow);
    } catch (err) {
      throw new Error(`Unable to get completed orders for user ${userId}: ${err}`);
    } finally {
      conn.release();
    }
  }
}

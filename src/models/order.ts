export class Order {
  constructor(
    readonly id: string,
    readonly productIds: [string],
    readonly productCount: number,
    readonly userId: string,
    readonly status: OrderStatus,
  ){}
  
  static fromRow(row: OrderRow): Order {
    const status = OrderStatus[row.status as keyof typeof OrderStatus];
    return new Order(row.id, row.product_ids, row.product_count, row.user_id, status);
  }
}

interface OrderRow {
  id: string;
  product_ids: [string];
  product_count: number;
  user_id: string;
  status: OrderStatus;
}

enum OrderStatus {
  open = 'open',
  cancelled = 'cancelled',
  completed = 'completed',
}

export type CreateOrderInput = {
  productIds: [string];
  productCount: number;
  userId: string;
}

export type UpdateOrderInput = {
  status: OrderStatus;
}
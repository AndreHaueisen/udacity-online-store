export class ProductOrder {
  constructor(
    readonly productId: number,
    readonly orderId: number,
    readonly quantity: number,
    readonly name: string,
    readonly category: string | null
  ) {}

  static fromRow(row: BookOrderRow): ProductOrder {
    return new ProductOrder(row.product_id, row.order_id, row.quantity, row.name, row.category);
  }
}

interface BookOrderRow {
  product_id: number;
  order_id: number;
  quantity: number;
  name: string;
  category: string | null;
}


export class Product {

  constructor(
    readonly id: string,
    readonly name: string,
    /// The price of the product in cents
    readonly price: number,
    readonly category: string | null,
  ){}

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
}
import { Store } from '../../models/store';
import { Product } from '../../models/product';

export class DashboardQueries extends Store {
  // get the five most popular products
  async getTopFiveSellingProducts(): Promise<Product[]> {
    const conn = await this.connectToDB();

    try {
      const sql = `
      SELECT products.id, products.name, products.price, products.category
      FROM products
      JOIN (
        SELECT product_id, SUM(quantity) as total_quantity
        FROM product_order
        GROUP BY product_id
        ORDER BY total_quantity DESC
        LIMIT 5
      ) AS product_sales ON products.id = product_sales.product_id
    `;

      const result = await conn.query(sql);

      return result.rows.map(Product.fromRow);
    } catch (err) {
      console.log(err);
      throw new Error(`Could not get top five products. Error: ${err}`);
    } finally {
      conn.release();
    }
  }
}

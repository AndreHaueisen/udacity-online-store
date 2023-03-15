import express, { Request, Response } from 'express';
import { DashboardQueries } from './dashboard';

const dashboard = express.Router();
const queries = new DashboardQueries();

dashboard.get('/topFiveSellingProducts', async (_: Request, res: Response) => {
  try {
    const products = await queries.getTopFiveSellingProducts();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export { dashboard };

import client from '../database';
import { PoolClient } from 'pg';

export class Store {
  async connectToDB(): Promise<PoolClient> {
    try {
      const conn = await client.connect();
      return conn;
    } catch (err) {
      throw new Error(`Unable to connect to db: ${err}`);
    }
  }
}

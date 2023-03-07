import { Store } from './store';

export class User {
  constructor(readonly id: string, readonly firstName: string, readonly lastName: string, readonly password: string) {}

  static fromRow(row: UserRow): User {
    return new User(row.id, row.first_name, row.last_name, row.password);
  }
}

interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  password: string;
}

export type UserInput = {
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore extends Store {
  constructor(readonly saltRounds: number, readonly pepper: string, readonly jwtSecret: string) {
    super();
  }

  async show(id: string): Promise<User> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);

      if (result.rows.length) {
        return User.fromRow(result.rows[0]);
      }

      throw new Error('User not found');
    } catch (err) {
      throw new Error(`Unable to get user ${id}: ${err}`);
    } finally {
      conn.release();
    }
  }
}

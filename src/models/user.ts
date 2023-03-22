import { Store } from './store';
import bcrypt from 'bcrypt';

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

export function isUserInput(body: unknown): body is UserInput {
  return (
    typeof body === 'object' &&
    body !== null &&
    'firstName' in body &&
    typeof body.firstName === 'string' &&
    'lastName' in body &&
    typeof body.lastName === 'string' &&
    'password' in body &&
    typeof body.password === 'string'
  );
}

export type AuthenticationInput = {
  id: string;
  password: string;
};

export function isAuthenticationInput(body: unknown): body is AuthenticationInput {
  return (
    typeof body === 'object' &&
    body !== null &&
    'id' in body &&
    typeof body.id === 'string' &&
    'password' in body &&
    typeof body.password === 'string'
  );
}

export class UserStore extends Store {
  constructor(readonly saltRounds: number, readonly pepper: string) {
    super();
  }

  async index(): Promise<User[]> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);

      return result.rows.map(User.fromRow);
    } catch {
      throw new Error('Unable to get users');
    } finally {
      conn.release();
    }
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

  async create(userInput: UserInput): Promise<User> {
    const conn = await super.connectToDB();

    try {
      const sql = 'INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *';
      const passwordHash = bcrypt.hashSync(userInput.password + this.pepper, this.saltRounds);

      const result = await conn.query(sql, [userInput.firstName, userInput.lastName, passwordHash]);

      return User.fromRow(result.rows[0]);
    } catch (err) {
      throw new Error(`Unable to create user: ${err}`);
    } finally {
      conn.release();
    }
  }

  async authenticate(authenticationInput: AuthenticationInput): Promise<User | null> {
    const conn = await super.connectToDB();

    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [authenticationInput.id]);

      if (result.rows.length) {
        const user = User.fromRow(result.rows[0]);

        if (bcrypt.compareSync(authenticationInput.password + this.pepper, user.password)) {
          return user;
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Unable to authenticate user ${authenticationInput.id}. ${err}`);
    } finally {
      conn.release();
    }
  }
}

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
}
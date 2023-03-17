# Storefront Backend Project

## Getting Started

1 - Create a .env file in the project's root folder that should contain

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=online_store
POSTGRES_TEST_DB=online_store_test
POSTGRES_USER=<your_user>
POSTGRES_PASSWORD=<your_password>
NODE_ENV=dev
BCRYPT_PASSWORD=<your_bcrypt_password>
BCRYPT_SALT_ROUNDS=<number_of_salt_rounds>
TOKEN_SECRET=<your_token_secret>
```

2 - Create a database.json in the project's root folder that should contain

```
{
    "dev": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "online_store",
      "user": "your_user",
      "password": "your_password"
    },
    "test": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "online_store_test",
      "user": "your_user",
      "password": "your_password"
    }
}
```

3 - Create the dev and test databases by running the following commands in your terminal:

```
createdb online_store
createdb online_store_test
```

4 - Create a database user by running the following command:
```
createuser <your_user>
```

5 - Give the user full access to the dev and test databases by running the following commands:
```
psql online_store
grant all privileges on database online_store to <your_user>;

psql online_store_test
grant all privileges on database online_store_test to <your_user>;
```

6 - The backend port number is set to 3000. The database port number is set to 5432.

7 - To build the projext use `npm run build`

8 - To run the tests use `npm run test`

9 - To start your server locally use `npm run start`

## pSQL Tables

The following tables have been created in the database:

### Enum Type

- `status` - an enum type with values `active`, `cancelled`, and `complete`

### Users Table

- `users` - a table with the following columns:
  - `id` - UUID primary key, default value is generated using the `uuid_generate_v4()` function
  - `first_name` - a required string with a maximum length of 50 characters
  - `last_name` - a required string with a maximum length of 120 characters
  - `password` - a required string

### Products Table

- `products` - a table with the following columns:
  - `id` - UUID primary key, default value is generated using the `uuid_generate_v4()` function
  - `name` - a required string with a maximum length of 120 characters
  - `price` - an integer representing the price of the product in cents
  - `category` - a string with a maximum length of 30 characters

### Orders Table

- `orders` - a table with the following columns:
  - `id` - UUID primary key, default value is generated using the `uuid_generate_v4()` function
  - `created_at` - a required timestamp with a default value of the current time
  - `user_id` - UUID foreign key referencing the `id` column of the `users` table
  - `status` - a string with a maximum length of 20 characters representing the status of the order

### Product Order Table

- `product_order` - a table with the following columns:
  - `id` - UUID primary key, default value is generated using the `uuid_generate_v4()` function
  - `order_id` - UUID foreign key referencing the `id` column of the `orders` table
  - `product_id` - UUID foreign key referencing the `id` column of the `products` table
  - `quantity` - an integer representing the quantity of the products ordered


## Routes

### Products

* `GET - /products`: returns all products in the database
* `GET - /products/:id`: returns a single product by ID
* `POST - /products`: creates a new product with the provided name, price, and category

### Users

* `GET - /users`: returns all users in the database
* `GET - /users/:id`: returns a single user by ID
* `GET - /users/authenticate`: authenticates a user with the id and password
* `POST - /users`: creates a new user with the provided first name, last name, and password

### Orders

* `GET - /orders`: returns all orders in the database
* `GET - /orders/:id`: returns a single order by ID
* `GET - /orders/currentOrder/:userId`: returns the user's current order
* `GET - /orders/completedOrders/:userId`: returns all of the user's completed orders
* `POST - /orders`: creates a new order with the provided user ID and status
* `POST - /orders/:id/addProduct`: adds a product to the order
* `POST - /orders/:id/complete`: completes the order with the provided order ID
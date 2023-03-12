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

3 - To build the projext use `npm run build`

4 - To run the tests use `npm run test`

5 - To start your server locally use `npm run start`
# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
- id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Schema

This database contains four tables: `users`, `products`, `orders`, and `product_order`.

#### Table `users`

This table stores user information.

| Column     | Data Type   | Constraints                      |
|------------|-------------|---------------------------------|
| id         | UUID        | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| first_name | VARCHAR(50) | NOT NULL                        |
| last_name  | VARCHAR(120)| NOT NULL                        |
| password   | VARCHAR     | NOT NULL                        |

#### Table `products`

This table stores product information.

| Column  | Data Type   | Constraints                      |
|---------|-------------|---------------------------------|
| id      | UUID        | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| name    | VARCHAR(120)| NOT NULL                        |
| price   | INTEGER     | NOT NULL                        |
| category| VARCHAR(30) |                                 |

#### Table `orders`

This table stores order information.

| Column     | Data Type   | Constraints                                 |
|------------|-------------|--------------------------------------------|
| id         | UUID        | PRIMARY KEY, DEFAULT uuid_generate_v4()      |
| created_at | TIMESTAMP   | NOT NULL, DEFAULT NOW()                     |
| user_id    | UUID        | NOT NULL, REFERENCES users(id)              |
| status     | VARCHAR(20) | NOT NULL                                   |

#### Table `product_order`

This table stores information about the products ordered in each order.

| Column     | Data Type   | Constraints                            |
|------------|-------------|---------------------------------------|
| id         | UUID        | PRIMARY KEY, DEFAULT uuid_generate_v4()|
| order_id   | UUID        | NOT NULL, REFERENCES orders(id)       |
| product_id | UUID        | NOT NULL, REFERENCES products(id)     |
| quantity   | INTEGER     | NOT NULL                               |

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(30)
);
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  products_ids VARCHAR[] NOT NULL,
  products_quantities INTEGER[] NOT NULL,
  user_id VARCHAR NOT NULL,
  status VARCHAR(20) NOT NULL
);
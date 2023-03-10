CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  products_ids VARCHAR[] NOT NULL,
  products_quantities INTEGER[] NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL
);
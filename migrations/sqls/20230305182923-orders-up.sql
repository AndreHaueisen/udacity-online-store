CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_ids VARCHAR[] NOT NULL,
  product_count INTEGER NOT NULL,
  user_id VARCHAR NOT NULL,
  status VARCHAR(20) NOT NULL
);
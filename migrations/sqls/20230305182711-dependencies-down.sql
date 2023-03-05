CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE status AS ENUM('open', 'cancelled', 'completed');
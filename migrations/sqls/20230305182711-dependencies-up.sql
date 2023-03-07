CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TYPE IF EXISTS status;
CREATE TYPE status AS ENUM('open', 'cancelled', 'completed');
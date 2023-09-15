import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.ORDER_SERVICE_DB_USER,
  host: process.env.ORDER_SERVICE_DB_HOST,
  database: process.env.ORDER_SERVICE_DB_NAME,
  password: process.env.ORDER_SERVICE_DB_PASSWORD,
  port: process.env.ORDER_SERVICE_DB_PORT,
});

export { pool };

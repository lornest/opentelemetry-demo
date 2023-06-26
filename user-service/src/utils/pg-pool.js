import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.USER_SERVICE_DB_USER,
  host: process.env.USER_SERVICE_DB_HOST,
  database: process.env.USER_SERVICE_DB_NAME,
  password: process.env.USER_SERVICE_DB_PASSWORD,
  port: process.env.USER_SERVICE_DB_PORT,
});

export { pool };
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isRenderDatabase =
  process.env.DATABASE_URL?.includes('render.com');

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ...(isRenderDatabase
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

export const query = (text, params) => {
  return pool.query(text, params);
};
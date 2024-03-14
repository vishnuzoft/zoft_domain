import * as dotenv from "dotenv";

import { environment } from "./env.config";

const { Pool } = require("pg");

dotenv.config();

export const pool = new Pool({
  user: environment.DB_USER,
  host: environment.DB_HOST,
  database: environment.DB_NAME,
  password: environment.DB_PASSWORD,
  port: environment.DB_PORT,
});

export const client = async () => {
  return await pool.connect();
};

export const begin = async (client: any) => {
  const begin = await client.query("BEGIN");
  return begin;
};
export const commit = async (client: any) => {
  const commit = await client.query("COMMIT");
  return commit;
};
export const rollback = async (client: any) => {
  const rollback = await client.query("ROLLBACK");
  return rollback;
};
export const release = async (client: any) => {
  const release = client.release();
  return release;
};

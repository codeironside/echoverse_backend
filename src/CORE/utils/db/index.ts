import { Pool } from "pg";
import { loadEnv } from "./env";

const env = loadEnv();

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
process.on("SIGTERM", () => {
  pool.end(() => {
    console.log("Database pool closed");
  });
});

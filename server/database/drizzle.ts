import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadConfig } from "../config";

const config = loadConfig();

const connectionString = `postgres://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_URL_DATABASE}`;
const sql = postgres(connectionString);

export const db = drizzle(sql);

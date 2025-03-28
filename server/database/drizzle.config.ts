import type { Config } from "drizzle-kit";
import { loadConfig } from "../config";

const config = loadConfig();

const connectionString = `postgres://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_URL_DATABASE}`;

export default {
  schema: "./database/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: connectionString,
  },
} satisfies Config;

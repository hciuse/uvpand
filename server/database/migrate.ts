import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { loadConfig } from "../config";

let sql: postgres.Sql<{}> | undefined;

try {
  console.log("Loading config");
  const config = loadConfig();

  console.log("Establishing database connection");
  const connectionString = `postgres://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_URL_DATABASE}`;
  sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  console.log("Starting database migration... (this may take a while)");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Database migrated successfully");
} catch (error) {
  console.error("Failed to migrate database", error);
  process.exit(1);
} finally {
  console.log("Closing database connection");
  if (sql) await sql.end();
}

process.exit(0);

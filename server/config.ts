import { config } from "dotenv";
import { z } from "zod";

export function loadConfig() {
  config();
  const envSchema = z.object({
    DB_USERNAME: z.string().nonempty(),
    DB_PASSWORD: z.string().nonempty(),
    DB_HOST: z.string().nonempty(),
    DB_PORT: z.string().nonempty(),
    DB_URL_DATABASE: z.string().nonempty(),
  });

  return envSchema.parse(process.env);
}

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  // CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string(),
  UPLOAD_DIR: z.string().default("../uploads"),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().default(6379),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid enviroment variables", _env.error.format());

  throw new Error("Invalid enviroment variables");
}

export const env = _env.data;

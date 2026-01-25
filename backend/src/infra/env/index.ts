import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  // CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  // DATABASE_URL: z.string(),
  // JWT_SECRET: z.string(),
  UPLOAD_DIR: z.string().default("../uploads"),
  MONGO_URI: z.string(),
  REDIS_URI: z.string(),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid enviroment variables", _env.error.format());

  throw new Error("Invalid enviroment variables");
}

export const env = _env.data;

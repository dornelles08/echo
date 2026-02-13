import "dotenv/config";
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
  STORAGE_TYPE: z.enum(["local", "s3"]).default("local"),
  MINIO_ENDPOINT: z.string().default("localhost"),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().default("minioadmin"),
  MINIO_SECRET_KEY: z.string().default("minioadmin"),
  MINIO_BUCKET: z.string().default("echo_dev"),
  MINIO_USE_SSL: z.coerce.boolean().default(false),
  MINIO_REGION: z.string().default("us-east-1"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid enviroment variables", _env.error.format());

  throw new Error("Invalid enviroment variables");
}

export const env = _env.data;

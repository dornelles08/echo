import { env } from "../../env";
import type { ConnectionOptions } from "bullmq";

export const redisConfig: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  // No Bun/Node, o BullMQ usa o ioredis por baixo
  maxRetriesPerRequest: null,
};

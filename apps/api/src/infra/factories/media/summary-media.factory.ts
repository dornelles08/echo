import { SummaryMediaUseCase } from "@echo/core";
import { PrismaMediaRepository } from "infra/database/prisma/repositories/prisma-media.repository";
import { RedisQueueService } from "infra/service/redis-queue.service";

export function makeSummaryMediaUseCase() {
  const mediaRepository = new PrismaMediaRepository();
  const queueService = new RedisQueueService();
  const useCase = new SummaryMediaUseCase(mediaRepository, queueService);
  return useCase;
}

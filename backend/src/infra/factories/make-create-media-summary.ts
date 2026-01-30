import { SummaryMediaUseCase } from "@/domain/media/use-cases/summary-media";
import { PrismaMediaRepository } from "@/infra/database/prisma/repositories/prisma-media.repository";
import { RedisQueueService } from "@/infra/service/redis-queue.service";

export function makeSummaryMediaUseCasee() {
  const mediaRepository = new PrismaMediaRepository();
  const queueService = new RedisQueueService();
  const useCase = new SummaryMediaUseCase(mediaRepository, queueService);
  return useCase;
}

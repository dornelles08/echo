import { CreateMediaUseCase } from "@/domain/media/use-cases/create-media";
import { PrismaMediaRepository } from "@/infra/database/prisma/repositories/prisma-media.repository";
import { RedisQueueService } from "@/infra/service/redis-queue.service";

export function makeCreateMediaUseCase() {
  const mediaRepository = new PrismaMediaRepository();
  const redisQueueService = new RedisQueueService();
  const useCase = new CreateMediaUseCase(mediaRepository, redisQueueService);

  return useCase;
}

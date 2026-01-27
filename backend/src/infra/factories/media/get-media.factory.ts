import { GetMediaUseCase } from "@/domain/media/use-cases/get-medias";
import { PrismaMediaRepository } from "@/infra/database/prisma/repositories/prisma-media.repository";

export function makeGetMediaUseCase() {
  const mediaRepository = new PrismaMediaRepository();
  const useCase = new GetMediaUseCase(mediaRepository);

  return useCase;
}

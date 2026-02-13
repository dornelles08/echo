import { GetMediaUseCase } from "@echo/core";
import { PrismaMediaRepository } from "infra/database/prisma/repositories/prisma-media.repository";

export function makeGetMediaUseCase() {
  const mediaRepository = new PrismaMediaRepository();
  const useCase = new GetMediaUseCase(mediaRepository);

  return useCase;
}

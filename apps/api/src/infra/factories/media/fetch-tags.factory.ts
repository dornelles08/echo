import { FetchTagsUseCase } from "@echo/core";
import { PrismaMediaRepository } from "infra/database/prisma/repositories/prisma-media.repository";

export function makeFetchTagsUseCase() {
  const mediaRepository = new PrismaMediaRepository();
  const useCase = new FetchTagsUseCase(mediaRepository);

  return useCase;
}

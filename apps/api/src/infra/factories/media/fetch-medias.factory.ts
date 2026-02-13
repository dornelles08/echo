import { FetchMediasUseCase } from "@echo/core";
import { PrismaMediaRepository } from "infra/database/prisma/repositories/prisma-media.repository";

export function makeFetchMediasUseCase() {
  const mediaRepository = new PrismaMediaRepository();
  const useCase = new FetchMediasUseCase(mediaRepository);

  return useCase;
}

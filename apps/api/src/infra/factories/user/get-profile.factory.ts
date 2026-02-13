import { GetProfileUseCase } from "@echo/core";
import { PrismaUserRepository } from "infra/database/prisma/repositories/prisma-user.repository";

export function makeGetProfileUseCase() {
  const userRepository = new PrismaUserRepository();
  const useCase = new GetProfileUseCase(userRepository);
  return useCase;
}

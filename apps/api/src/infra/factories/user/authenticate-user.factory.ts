import { AuthenticateUserUseCase } from "@echo/core";
import { PrismaUserRepository } from "infra/database/prisma/repositories/prisma-user.repository";
import { BcryptService } from "infra/service/bcrypt.service";

export function makeAuthenticateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const bcryptService = new BcryptService();
  const useCase = new AuthenticateUserUseCase(userRepository, bcryptService);
  return useCase;
}

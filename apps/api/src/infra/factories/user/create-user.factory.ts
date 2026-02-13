import { CreateUserUseCase } from "@echo/core";
import { PrismaUserRepository } from "infra/database/prisma/repositories/prisma-user.repository";
import { BcryptService } from "infra/service/bcrypt.service";

export function makeCreateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const bcryptService = new BcryptService();
  const useCase = new CreateUserUseCase(userRepository, bcryptService);
  return useCase;
}

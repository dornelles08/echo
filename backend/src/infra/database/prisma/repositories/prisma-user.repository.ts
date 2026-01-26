import type { User } from "@/domain/user/entities/User";
import type { UserRepository } from "@/domain/user/repositories/user.repository";
import { prisma } from "..";
import { PrismaUserMapper } from "../mappers/prisma-user.mapper";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await prisma.user.create({
      data,
    });
  }
}

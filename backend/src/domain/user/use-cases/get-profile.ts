import { type Either, left, right } from "@/core/either";
import { EntityNotFoundError } from "@/core/errors/entity-not-found.error";
import type { User } from "@/domain/user/entities/User";
import type { UserRepository } from "@/domain/user/repositories/user.repository";

interface GetProfileUseCaseRequest {
  userId: string;
}

type GetProfileUseCaseResponse = Either<
  EntityNotFoundError,
  {
    user: User;
  }
>;

export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new EntityNotFoundError("User"));
    }

    return right({
      user,
    });
  }
}

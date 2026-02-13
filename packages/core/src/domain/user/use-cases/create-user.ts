import { type Either, left, right } from "../../../either";
import { User } from "../entities/User";
import type { UserRepository } from "../repositories/user.repository";
import type { CryptService } from "../services/crypt.service";
import { EmailAlreadyExistsError } from "./errors/email-already-registered.error";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateUserUseCaseResponse = Either<
  EmailAlreadyExistsError,
  {
    user: User;
  }
>;

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptService: CryptService,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      return left(new EmailAlreadyExistsError());
    }

    const passwordHash = await this.cryptService.hash(password);

    const user = User.create({
      name,
      email,
      passwordHash,
    });

    await this.userRepository.create(user);

    return right({
      user,
    });
  }
}

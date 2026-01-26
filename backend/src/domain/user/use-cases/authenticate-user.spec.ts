import { EntityNotFoundError } from "@/core/errors/entity-not-found.error";
import { makeUserFactory } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user.repository";
import { FakeCryptService } from "@test/services/fake-crypt.service";
import { beforeEach, describe, expect, it } from "bun:test";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { WrongPasswordError } from "./errors/wrong-password.error";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeCryptService: FakeCryptService;
let sut: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeCryptService = new FakeCryptService();
    sut = new AuthenticateUserUseCase(inMemoryUserRepository, fakeCryptService);
  });

  it("should be able to authenticate a user", async () => {
    const user = makeUserFactory({
      passwordHash: await fakeCryptService.hash("123456"),
    });
    await inMemoryUserRepository.create(user);

    const result = await sut.execute({
      email: user.email,
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.items[0]).toEqual(result.value?.user);
  });

  it("should not be able to authenticate a user with wrong email", async () => {
    const user = makeUserFactory({
      passwordHash: await fakeCryptService.hash("123456"),
    });
    await inMemoryUserRepository.create(user);

    const result = await sut.execute({
      email: "email@email.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotFoundError);
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    const user = makeUserFactory();
    await inMemoryUserRepository.create(user);

    const result = await sut.execute({
      email: user.email,
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongPasswordError);
  });
});

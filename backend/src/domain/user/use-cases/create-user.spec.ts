import { beforeEach, describe, expect, it } from "bun:test";

import { InMemoryUserRepository } from "@test/repositories/in-memory-user.repository";
import { FakeCryptService } from "@test/services/fake-crypt.service";
import { CreateUserUseCase } from "./create-user";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeCryptService: FakeCryptService;
let sut: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeCryptService = new FakeCryptService();
    sut = new CreateUserUseCase(inMemoryUserRepository, fakeCryptService);
  });

  it("should be able to create a new user", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.items[0]).toEqual(result.value?.user);
  });

  it("should not be able to create a new user with an existing email", async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
  });
});

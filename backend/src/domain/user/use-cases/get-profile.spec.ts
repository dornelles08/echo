import { beforeEach, describe, expect, it } from "bun:test";

import { EntityNotFoundError } from "@/core/errors/entity-not-found.error";
import { makeUserFactory } from "@test/factories/make-user";
import { InMemoryUserRepository } from "@test/repositories/in-memory-user.repository";

import { GetProfileUseCase } from "./get-profile";

let inMemoryUserRepository: InMemoryUserRepository;
let sut: GetProfileUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();

    sut = new GetProfileUseCase(inMemoryUserRepository);
  });

  it("should be able to create a new user", async () => {
    const user = makeUserFactory();
    await inMemoryUserRepository.create(user);

    const result = await sut.execute({
      userId: user.id,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.items[0]).toEqual(result.value?.user);
  });

  it("should not be able to create a new user with an existing email", async () => {
    const result = await sut.execute({
      userId: "user-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EntityNotFoundError);
  });
});

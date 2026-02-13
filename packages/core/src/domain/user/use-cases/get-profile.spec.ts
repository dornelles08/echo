import { beforeEach, describe, expect, it } from "vitest";

import { EntityNotFoundError } from "../../../errors/entity-not-found.error";
import { makeUserFactory, InMemoryUserRepository } from "../../../test";

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

import { faker } from "@faker-js/faker";

import { User, type UserProps } from "@/domain/user/entities/User";

export function makeUserFactory(overrides: Partial<UserProps> = {}, id?: string) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      ...overrides,
    },
    id,
  );

  return user;
}

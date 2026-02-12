import type { User } from "@/domain/user/entities/User";
import type { UserRepository } from "@/domain/user/repositories/user.repository";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email);
    return user ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === id);
    return user ?? null;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }
}

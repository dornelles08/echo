import type { CryptService } from "@echo/core";
import { compare, hash } from "bcrypt";

export class BcryptService implements CryptService {
  hash(plain: string): Promise<string> {
    return hash(plain, 10);
  }
  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}

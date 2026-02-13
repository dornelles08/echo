import type { Status } from "../../entities/Status";

export class InvalidStatusError extends Error {
  constructor(status: Status | undefined, operation: string) {
    super(`Invalid status (${status || "pending"}) for this operation (${operation}).`);
  }
}

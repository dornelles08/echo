import type { FastifyInstance } from "fastify";

import { createUser } from "../controllers/user/create-user.controller";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", createUser);
}

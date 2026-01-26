import type { FastifyInstance } from "fastify";

import { authenticateUser } from "../controllers/auth/authenticate-user.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/authenticate", authenticateUser);
}

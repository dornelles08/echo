import type { FastifyInstance } from "fastify";

import { createMedia } from "../controllers/media/create-media.controller";
import { verifyJwt } from "../middlewares/verify-jwt";

export async function mediaRoutes(app: FastifyInstance) {
  app.post("/", { onRequest: [verifyJwt] }, createMedia);
}

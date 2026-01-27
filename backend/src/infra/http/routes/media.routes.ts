import type { FastifyInstance } from "fastify";

import { createMedia } from "../controllers/media/create-media.controller";
import { fetchMedias } from "../controllers/media/fetch-medias.controller";
import { getMedia } from "../controllers/media/get-medias.controller";
import { verifyJwt } from "../middlewares/verify-jwt";

export async function mediaRoutes(app: FastifyInstance) {
  app.post("/", { onRequest: [verifyJwt] }, createMedia);
  app.get("/", { onRequest: [verifyJwt] }, fetchMedias);
  app.get("/:mediaId", { onRequest: [verifyJwt] }, getMedia);
}

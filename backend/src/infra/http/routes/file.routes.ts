import type { FastifyInstance } from "fastify";

import { uploadFile } from "../controllers/file/upload-file.controller";

export async function fileRoutes(app: FastifyInstance) {
  app.post("/upload", uploadFile);
}

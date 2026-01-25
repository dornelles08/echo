import type { FastifyInstance } from "fastify";
import { uploadFile } from "../controllers/upload-file.controller";

export async function fileRoutes(app: FastifyInstance) {
  app.post("/upload", uploadFile);
}

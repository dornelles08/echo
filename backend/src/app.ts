import multipart from "@fastify/multipart";
import fastify from "fastify";
import { fileRoutes } from "./infra/http/routes/file.routes";

export const app = fastify({
  logger: true,
});

await app.register(multipart, {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB (ajuste conforme necessário)
  },
});

app.get("/hello", () => "Hello World");

app.register(fileRoutes, { prefix: "/files" });

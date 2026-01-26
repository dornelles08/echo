import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { env } from "./infra/env";
import { authRoutes } from "./infra/http/routes/auth.routes";
import { fileRoutes } from "./infra/http/routes/file.routes";
import { mediaRoutes } from "./infra/http/routes/media.routes";
import { userRoutes } from "./infra/http/routes/user.routes";

export const app = fastify({
  logger: true,
});

await app.register(multipart, {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB (ajuste conforme necessário)
  },
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "1h",
  },
});

app.register(fastifyHelmet);
app.register(fastifyCookie);

app.get("/hello", () => "Hello World");

app.register(fileRoutes, { prefix: "/files" });
app.register(mediaRoutes, { prefix: "/medias" });
app.register(userRoutes, { prefix: "/users" });
app.register(authRoutes);

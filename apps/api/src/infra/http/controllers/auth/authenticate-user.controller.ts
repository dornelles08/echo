import { EntityNotFoundError } from "@echo/core";
import { WrongPasswordError } from "@echo/core";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeAuthenticateUserUseCase } from "infra/factories/user/authenticate-user.factory";
import z from "zod";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  const authenticateUserBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateUserBodySchema.parse(request.body);

  const authenticateUserUseCase = makeAuthenticateUserUseCase();

  const result = await authenticateUserUseCase.execute({
    email,
    password,
  });

  if (result.isLeft()) {
    const error = result.value;

    switch (error.constructor) {
      case EntityNotFoundError:
      case WrongPasswordError:
        return reply.status(401).send({
          message: "Invalid email or password.",
        });
      default:
        return reply.status(500).send({
          message: "Internal server error.",
        });
    }
  }

  const { user } = result.value;

  const token = await reply.jwtSign({ sub: user.id });

  const refreshToken = await reply.jwtSign({
    sign: {
      sub: user.id,
      expiresIn: "7d",
    },
  });

  return reply
    .status(200)
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({ token });
}

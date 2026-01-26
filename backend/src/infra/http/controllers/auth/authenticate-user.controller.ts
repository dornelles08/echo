import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { makeAuthenticateUserUseCase } from "@/infra/factories/user/authenticate-user.factory";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
  const authenticateUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateUserBodySchema.parse(request.body);

  const authenticateUserUseCase = makeAuthenticateUserUseCase();

  const result = await authenticateUserUseCase.execute({
    email,
    password,
  });

  if (result.isLeft()) {
    return reply.status(400).send({
      message: result.value.message,
    });
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

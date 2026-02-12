import type { FastifyReply, FastifyRequest } from "fastify";

import { makeGetProfileUseCase } from "@/infra/factories/user/get-profile.factory";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user;

  const getProfileUseCase = makeGetProfileUseCase();

  const result = await getProfileUseCase.execute({
    userId,
  });

  if (result.isLeft()) {
    return reply.status(400).send({
      message: result.value.message,
    });
  }

  return reply.status(200).send({ user: result.value.user });
}

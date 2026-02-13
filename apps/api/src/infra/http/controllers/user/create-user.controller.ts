import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateUserUseCase } from "infra/factories/user/create-user.factory";
import { z } from "zod";


export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = createUserBodySchema.parse(request.body);

  const createUserUseCase = makeCreateUserUseCase();

  const result = await createUserUseCase.execute({
    name,
    email,
    password,
  });

  if (result.isLeft()) {
    return reply.status(400).send({
      message: result.value.message,
    });
  }

  return reply.status(201).send();
}

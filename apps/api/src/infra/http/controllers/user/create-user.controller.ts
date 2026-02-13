import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateUserUseCase } from "infra/factories/user/create-user.factory";
import { registerSchema } from "@echo/contracts";


export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerSchema.parse(request.body);

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

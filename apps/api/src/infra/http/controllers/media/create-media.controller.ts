import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateMediaUseCase } from "infra/factories/media/create-media.factory";
import { createMediaSchema } from "@echo/contracts";


export async function createMedia(request: FastifyRequest, reply: FastifyReply) {
  const { filename, url, prompt, tags, type, language, duration } = createMediaSchema.parse(
    request.body,
  );

  const { sub: userId } = request.user;

  const createMediaUseCase = makeCreateMediaUseCase();

  const result = await createMediaUseCase.execute({
    filename,
    url,
    prompt,
    language,
    duration,
    tags,
    type,
    userId,
  });

  if (result.isLeft()) {
    return reply.status(500).send();
  }

  return reply.status(201).send();
}

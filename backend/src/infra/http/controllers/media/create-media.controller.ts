import { makeCreateMediaUseCase } from "@/infra/factories/media/create-media.factory";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function createMedia(request: FastifyRequest, reply: FastifyReply) {
  const createMediaBodySchema = z.object({
    filename: z.string(),
    url: z.string(),
    type: z.enum(["video", "audio"]).optional(),
    prompt: z.string().optional(),
    tags: z.array(z.string()).optional(),
  });

  const { filename, url, prompt, tags, type } = createMediaBodySchema.parse(request.body);

  const CreateMediaUseCase = makeCreateMediaUseCase();

  const result = await CreateMediaUseCase.execute({
    filename,
    url,
    prompt,
    tags,
    type,
    userId: "1",
  });

  if (result.isLeft()) {
    return reply.status(500).send();
  }

  return reply.status(201).send();
}

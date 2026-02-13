import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetMediaUseCase } from "infra/factories/media/get-media.factory";
import { MediaPresenter } from "infra/http/presenters/media.presenter";
import z from "zod";


export async function getMedia(request: FastifyRequest, reply: FastifyReply) {
  const getMediaParamsSchema = z.object({
    mediaId: z.string(),
  });

  const { mediaId } = getMediaParamsSchema.parse(request.params);

  const { sub: userId } = request.user;

  const fetchMediasUseCase = makeGetMediaUseCase();

  const result = await fetchMediasUseCase.execute({
    mediaId,
    userId,
  });

  if (result.isLeft()) {
    return reply.status(500).send();
  }

  const { media } = result.value;

  return reply.status(200).send({ media: MediaPresenter.toHTTP(media) });
}

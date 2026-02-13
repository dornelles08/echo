import type { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchMediasUseCase } from "infra/factories/media/fetch-medias.factory";
import { MediaPresenter } from "infra/http/presenters/media.presenter";
import z from "zod";


export async function fetchMedias(request: FastifyRequest, reply: FastifyReply) {
  const fetchmediasQuerySchema = z.object({
    page: z.coerce.number().optional().default(1),
    perPage: z.coerce.number().optional().default(20),
    tags: z
      .string()
      .transform((val) => val.split(","))
      .pipe(z.array(z.string()))
      .optional(),
    type: z.enum(["video", "audio"]).optional(),
    language: z.string().optional(),
    status: z
      .enum([
        "peding_transcription",
        "processing_transcription",
        "failed_transcription",
        "transcribed",
        "pending_conversion",
        "processing_conversion",
        "failed_conversion",
        "pending_summary",
        "processing_summary",
        "failed_summary",
        "summarized",
      ])
      .optional(),
  });

  const { page, perPage, tags, type, status, language } = fetchmediasQuerySchema.parse(
    request.query,
  );

  const { sub: userId } = request.user;

  const fetchMediasUseCase = makeFetchMediasUseCase();

  const result = await fetchMediasUseCase.execute({
    perPage,
    page,
    userId,
    language,
    tags,
    type,
    status,
  });

  if (result.isLeft()) {
    return reply.status(500).send();
  }

  const { medias, meta } = result.value;

  return reply.status(200).send(MediaPresenter.toHTTPCollection(medias, meta));
}

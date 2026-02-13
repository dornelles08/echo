import { EntityNotFoundError } from "@echo/core";
import { AlreadyProcessedError } from "@echo/core";
import { InvalidStatusError } from "@echo/core";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeSummaryMediaUseCase } from "infra/factories/media/summary-media.factory";
import { z } from "zod";

export async function summaryMedia(request: FastifyRequest, reply: FastifyReply) {
  const summaryMediaParamsSchema = z.object({
    mediaId: z.string(),
  });

  const summaryMediaBodySchema = z.object({
    prompt: z.string().min(1, "Prompt is required").max(500, "Prompt too long"),
  });

  const { mediaId } = summaryMediaParamsSchema.parse(request.params);
  const { prompt } = summaryMediaBodySchema.parse(request.body);
  const { sub: userId } = request.user;

  const createMediaSummaryUseCase = makeSummaryMediaUseCase();

  const result = await createMediaSummaryUseCase.execute({
    mediaId,
    userId,
    prompt,
  });

  if (result.isLeft()) {
    const error = result.value;

    switch (error.constructor) {
      case EntityNotFoundError:
        return reply.status(404).send({ error: error.message });
      case InvalidStatusError:
        return reply.status(400).send({ error: error.message });
      case AlreadyProcessedError:
        return reply.status(409).send({ error: error.message });
      default:
        return reply.status(500).send({ error: "Internal server error" });
    }
  }

  return reply.status(202).send({
    message: "Summary request accepted and queued for processing",
    mediaId,
  });
}

import { type Either, left, right } from "../../../either";
import { EntityNotFoundError } from "../../../errors/entity-not-found.error";
import type { Media } from "../entities/Media";
import type { MediaRepository } from "../repositories/media.repository";
import type { QueueService } from "../services/queue.service";
import { AlreadyProcessedError } from "./errors/already-processed.error";
import { InvalidStatusError } from "./errors/invalid-status.error";

interface SummaryMediaUseCaseRequest {
  mediaId: string;
  userId: string;
  prompt: string;
}

type SummaryMediaUseCaseResponse = Either<
  EntityNotFoundError | InvalidStatusError | AlreadyProcessedError,
  { media: Media }
>;

export class SummaryMediaUseCase {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly queueService: QueueService,
  ) {}

  async execute({
    mediaId,
    userId,
    prompt,
  }: SummaryMediaUseCaseRequest): Promise<SummaryMediaUseCaseResponse> {
    const media = await this.mediaRepository.findById(mediaId, userId);

    if (!media) {
      return left(new EntityNotFoundError("Media"));
    }

    if (!media.transcription || media.status !== "transcribed") {
      return left(new InvalidStatusError(media.status, "summary"));
    }

    if (media.summary && media.summaryPrompt === prompt) {
      return left(new AlreadyProcessedError());
    }

    media.summaryPrompt = prompt;
    media.status = "pending_summary";

    await this.mediaRepository.save(media);

    await this.queueService.publish("media_summary_queue", {
      mediaId: media.id,
      transcription: media.transcription,
      prompt: prompt,
    });

    return right({ media });
  }
}

import { type Either, right } from "@/core/either";
import { Media } from "../entities/Media";
import type { MediaRepository } from "../repositories/media.repository";
import type { QueueService } from "../services/queue.service";

interface CreateMediaUseCaseRequest {
  filename: string;
  url: string;
  type?: "video" | "audio";
  prompt?: string;
  tags?: string[];
  userId: string;
}

type CreateMediaUseCaseResponse = Either<null, { media: Media }>;

export class CreateMediaUseCase {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly queueService: QueueService,
  ) {}

  async execute({
    filename,
    url,
    type,
    prompt,
    tags,
    userId,
  }: CreateMediaUseCaseRequest): Promise<CreateMediaUseCaseResponse> {
    const media = new Media({
      filename,
      url,
      type,
      prompt,
      tags,
      userId,
    });

    await this.mediaRepository.create(media);

    if (type === "video") {
      await this.queueService.publish("media_conversion_queue", {
        mediaId: media.id,
        url: media.url,
      });
    }

    if (type === "audio") {
      await this.queueService.publish("media_transcription_queue", {
        mediaId: media.id,
        url: media.url,
      });
    }

    return right({ media });
  }
}

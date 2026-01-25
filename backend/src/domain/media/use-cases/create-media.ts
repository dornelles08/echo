import { right, type Either } from "@/core/either";
import { Media } from "../entities/Media";
import type { MediaRepository } from "../repositories/media.repository";

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
  constructor(private readonly mediaRepository: MediaRepository) {}

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

    return right({ media });
  }
}

import { type Either, right } from "@/core/either";
import type { Media } from "../entities/Media";
import type { MediaRepository } from "../repositories/media.repository";

interface FetchMediaUseCaseRequest {
  userId: string;
  tags?: string[];
  type?: "video" | "audio";
  status?: string;
  page: number;
  perPage: number;
}

type FetchMediaUseCaseResponse = Either<null, { medias: Media[] }>;

export class FetchMediasUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute({
    userId,
    perPage,
    page,
    tags,
    type,
    status,
  }: FetchMediaUseCaseRequest): Promise<FetchMediaUseCaseResponse> {
    const medias = await this.mediaRepository.findAll(
      userId,
      {
        tags,
        type,
        status,
      },
      {
        page,
        perPage,
      },
    );

    return right({ medias });
  }
}

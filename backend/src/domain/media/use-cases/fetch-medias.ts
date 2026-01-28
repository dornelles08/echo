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

type FetchMediaUseCaseResponse = Either<null, { 
  medias: Media[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}>;

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
    const result = await this.mediaRepository.findAll(
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

    const totalPages = Math.ceil(result.total / perPage);

    return right({ 
      medias: result.medias,
      meta: {
        page,
        perPage,
        total: result.total,
        totalPages,
      },
    });
  }
}

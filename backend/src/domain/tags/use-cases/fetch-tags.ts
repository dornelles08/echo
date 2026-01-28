import { type Either, right } from "@/core/either";

import type { MediaRepository } from "@/domain/media/repositories/media.repository";

interface FetchTagsRequest {
  userId: string;
}

type FetchTagsResponse = Either<
  null,
  {
    tags: string[];
  }
>;

export class FetchTagsUseCase {
  constructor(private mediaRepository: MediaRepository) {}

  async execute({ userId }: FetchTagsRequest): Promise<FetchTagsResponse> {
    const tags = await this.mediaRepository.findUserTags(userId);

    return right({ tags: tags.sort() });
  }
}

import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Media } from "@/domain/media/entities/Media";
import type { MediaFilters, MediaRepository } from "@/domain/media/repositories/media.repository";

export class InMemoryMediaRepository implements MediaRepository {
  items: Media[] = [];

  async create(media: Media): Promise<void> {
    this.items.push(media);
  }

  async findById(id: string): Promise<Media | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async save(media: Media): Promise<void> {
    const index = this.items.findIndex((item) => item.id === media.id);
    if (index >= 0) {
      this.items[index] = media;
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }

  async findAll(
    userId?: string,
    filters?: MediaFilters,
    filterpagination?: PaginationParams,
  ): Promise<{ medias: Media[]; total: number }> {
    let result = this.items;

    if (userId) {
      result = result.filter((media) => media.userId === userId);
    }
    if (filters?.type) {
      result = result.filter((media) => media.type === filters.type);
    }
    if (filters?.tags && filters.tags.length > 0) {
      result = result.filter((media) => filters.tags?.every((tag) => media.tags?.includes(tag)));
    }
    if (filters?.status) {
      result = result.filter((media) => media.status === filters.status);
    }
    if (filters?.language) {
      result = result.filter((media) => media.language === filters.language);
    }

    const total = result.length;

    if (filterpagination) {
      const { page, perPage } = filterpagination;
      const start = (page - 1) * perPage;
      const end = start + perPage;
      result = result.slice(start, end);
    }

    return {
      medias: result,
      total,
    };
  }

  async findUserTags(userId: string): Promise<string[]> {
    const userMedias = this.items.filter((media) => media.userId === userId);
    const allTags = userMedias.flatMap((media) => media.tags || []);
    return [...new Set(allTags)];
  }
}

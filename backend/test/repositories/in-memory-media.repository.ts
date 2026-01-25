import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Media } from "@/domain/media/entities/Media";
import type { MediaFilters, MediaRepository } from "@/domain/media/repositories/media.repository";

export class InMemoryMediaRepository implements MediaRepository {
  items: Media[] = [];

  async create(media: Media): Promise<void> {
    this.items.push(media);
  }

  async findAll(
    userId?: string,
    filters?: MediaFilters,
    filterpagination?: PaginationParams,
  ): Promise<Media[]> {
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

    if (filterpagination) {
      const { page, perPage } = filterpagination;
      const start = (page - 1) * perPage;
      const end = start + perPage;
      result = result.slice(start, end);
    }

    return result;
  }

  async findById(id: string): Promise<Media | null> {
    const media = this.items.find((item) => item.id === id) || null;
    return media;
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
}

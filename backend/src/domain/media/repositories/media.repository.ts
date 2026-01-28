import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Media } from "../entities/Media";

export interface MediaFilters {
  type?: string;
  tags?: string[];
  status?: string;
}

export interface MediaRepository {
  create(media: Media): Promise<void>;
  findAll(
    userId: string,
    filters?: MediaFilters,
    filterpagination?: PaginationParams,
  ): Promise<{
    medias: Media[];
    total: number;
  }>;
  findById(id: string, userId: string): Promise<Media | null>;
  save(media: Media): Promise<void>;
  delete(id: string): Promise<void>;
  findUserTags(userId: string): Promise<string[]>;
}

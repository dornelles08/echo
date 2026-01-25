import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Media } from "../entities/Media";

export interface MediaFilters {
  type?: string;
  tags?: string[];
}

export interface MediaRepository {
  create(media: Media): Promise<void>;
  findAll(
    userId?: string,
    filters?: MediaFilters,
    filterpagination?: PaginationParams,
  ): Promise<Media[]>;
  findById(id: string): Promise<Media | null>;
  save(media: Media): Promise<void>;
  delete(id: string): Promise<void>;
}

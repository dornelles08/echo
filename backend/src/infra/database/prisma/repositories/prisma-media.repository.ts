/** biome-ignore-all lint/suspicious/noExplicitAny: Porque eu quero */

import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Media } from "@/domain/media/entities/Media";
import type { MediaFilters, MediaRepository } from "@/domain/media/repositories/media.repository";
import { prisma } from "..";
import { PrismaMediaMapper } from "../mappers/prisma-media.mapper";
export class PrismaMediaRepository implements MediaRepository {
  async create(media: Media): Promise<void> {
    const data = PrismaMediaMapper.toPrisma(media);

    await prisma.media.create({
      data,
    });
  }

  async findAll(
    userId?: string,
    filters?: MediaFilters,
    filterpagination?: PaginationParams,
  ): Promise<{ medias: Media[]; total: number }> {
    const whereClause: any = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (filters?.type) {
      whereClause.type = filters.type;
    }

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const tags = filters?.tags?.filter((tag) => tag.trim() !== "");
    if (tags && tags.length > 0) {
      whereClause.tags = {
        hasSome: tags,
      };
    }

    const page = filterpagination?.page ?? 1;
    const perPage = filterpagination?.perPage ?? 10;
    const skip = (page - 1) * perPage;

    const [medias, total] = await Promise.all([
      prisma.media.findMany({
        where: whereClause,
        skip,
        take: perPage,
      }),
      prisma.media.count({ where: whereClause }),
    ]);

    return {
      medias: medias.map(PrismaMediaMapper.toDomain),
      total,
    };
  }

  async findById(id: string, userId: string): Promise<Media | null> {
    const media = await prisma.media.findUnique({
      where: { id, userId },
    });

    if (!media) {
      return null;
    }

    return PrismaMediaMapper.toDomain(media);
  }

  async save(media: Media): Promise<void> {
    const data = PrismaMediaMapper.toPrisma(media);

    await prisma.media.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.media.delete({
      where: { id },
    });
  }

  async findUserTags(userId: string): Promise<string[]> {
    const result = await prisma.media.aggregateRaw({
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$userId", { $toObjectId: userId }],
            },
          },
        },
        { $unwind: "$tags" },
        {
          $group: {
            _id: null,
            tags: { $addToSet: "$tags" },
          },
        },
        {
          $project: {
            _id: 0,
            tags: 1,
          },
        },
      ],
    });

    const tags = (result[0] as { tags?: string[] } | undefined)?.tags;
    return tags || [];
  }
}

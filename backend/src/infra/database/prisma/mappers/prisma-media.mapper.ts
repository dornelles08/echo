import { Media } from "@/domain/media/entities/Media";

import type { Prisma, Media as PrismaMedia } from "../generated/prisma/client";

export namespace PrismaMediaMapper {
  export function toDomain(raw: PrismaMedia): Media {
    return Media.create(
      {
        filename: raw.filename,
        url: raw.url,
        type: raw.type as "video" | "audio",
        prompt: raw.prompt ? raw.prompt : undefined,
        transcription: raw.transcription ? raw.transcription : undefined,
        tags: raw.tags,
        userId: raw.userId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }

  export function toPrisma(media: Media): Prisma.MediaUncheckedCreateInput {
    return {
      filename: media.filename,
      url: media.url,
      type: media.type as "video" | "audio",
      tags: media.tags,
      status: media.status,
      prompt: media.prompt,
      transcription: media.transcription,
      userId: media.userId,
    };
  }
}

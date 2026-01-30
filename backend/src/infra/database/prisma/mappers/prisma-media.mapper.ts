import { Media } from "@/domain/media/entities/Media";
import type { Prisma, Media as PrismaMedia, Segment as SegmentModel } from "../generated/prisma/client";
import { PrismaSegmentMapper } from "./prisma-segment.mapper";

export namespace PrismaMediaMapper {
  export function toDomain(raw: PrismaMedia): Media {
    return Media.create(
      {
        filename: raw.filename,
        url: raw.url,
        type: raw.type as "video" | "audio",
        prompt: raw.prompt ? raw.prompt : undefined,
        transcription: raw.transcription ? raw.transcription : undefined,
        status: raw.status,
        language: raw.language,
        duration: raw.duration,
        segments: raw.segments
          ? (raw.segments as SegmentModel[]).map(PrismaSegmentMapper.toDomain)
          : [],
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
      language: media.language,
      duration: media.duration,
      segments: media.segments ? media.segments.map(PrismaSegmentMapper.toPrisma) : [],
      status: media.status,
      prompt: media.prompt,
      transcription: media.transcription,
      userId: media.userId,
    };
  }
}

import type { Segment as DomainSegment } from "@echo/core";
import type { Segment as SegmentModel } from "../generated/prisma/client";

export namespace PrismaSegmentMapper {
  export function toDomain(raw: SegmentModel): DomainSegment {
    return {
      id: parseInt(raw.id, 10),
      start: raw.start,
      end: raw.end,
      text: raw.text,
      avg_logprob: raw.avg_logprob,
      compression_ratio: raw.compression_ratio,
      no_speech_prob: raw.no_speech_prob,
    };
  }

  export function toPrisma(segment: DomainSegment): {
    id: string;
    start: number;
    end: number;
    text: string;
    avg_logprob: number;
    compression_ratio: number;
    no_speech_prob: number;
  } {
    return {
      id: String(segment.id),
      start: segment.start,
      end: segment.end,
      text: segment.text,
      avg_logprob: segment.avg_logprob,
      compression_ratio: segment.compression_ratio,
      no_speech_prob: segment.no_speech_prob,
    };
  }
}

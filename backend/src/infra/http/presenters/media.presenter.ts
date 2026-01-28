import type { Media } from "@/domain/media/entities/Media";

export interface MediaPresenterResponse {
  id: string;
  filename: string;
  url: string;
  type?: "video" | "audio";
  prompt?: string;
  transcription?: string;
  status?: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MediasPresenterResponse {
  medias: MediaPresenterResponse[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export namespace MediaPresenter {
  export function toHTTP(media: Media): MediaPresenterResponse {
    return {
      id: media.id,
      filename: media.filename,
      url: media.url,
      type: media.type,
      prompt: media.prompt,
      transcription: media.transcription,
      status: media.status,
      tags: media.tags || [],
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }

  export function toHTTPCollection(medias: Media[], pagination?: any): MediasPresenterResponse {
    return {
      medias: medias.map((media) => toHTTP(media)),
      pagination: pagination || {
        page: 1,
        perPage: 20,
        total: medias.length,
        totalPages: 1,
      },
    };
  }
}

import { EntityNotFoundError } from "@/core/errors/entity-not-found.error";
import { Media } from "@/domain/media/entities/Media";
import { CreateMediaSummaryUseCase } from "@/domain/media/use-cases/summary-media";
import { MemoryQueueService } from "@test/services/memory-queue.service";
import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryMediaRepository } from "../../../../test/repositories/in-memory-media.repository";
import type { Status } from "../entities/Status";
import { InvalidStatusError } from "./errors/invalid-status.error";

let mediaRepository: InMemoryMediaRepository;
let queueService: MemoryQueueService;
let sut: CreateMediaSummaryUseCase;

describe("Create Media Summary Use Case", () => {
  beforeEach(() => {
    mediaRepository = new InMemoryMediaRepository();
    queueService = new MemoryQueueService();
    sut = new CreateMediaSummaryUseCase(mediaRepository, queueService);
  });

  it("should not create summary if media does not exist", async () => {
    const result = await sut.execute({
      mediaId: "non-existent-media-id",
      userId: "user-1",
      prompt: "Summarize this content",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it("should not create summary if transcription is not complete", async () => {
    const userId = "user-1";

    const media = Media.create({
      filename: "audio-1.mp3",
      url: "http://example.com/audio-1.mp3",
      type: "audio",
      language: "en",
      duration: 120,
      status: "pending_summary" as Status,
      userId,
    });

    await mediaRepository.create(media);

    const result = await sut.execute({
      mediaId: media.id,
      userId,
      prompt: "Summarize this content",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidStatusError);
    }
  });

  it("should create summary request and queue job when transcription is complete", async () => {
    const userId = "user-1";
    const prompt = "Create a summary of this content";

    const media = Media.create({
      filename: "audio-1.mp3",
      url: "http://example.com/audio-1.mp3",
      type: "audio",
      language: "en",
      duration: 120,
      transcription: "This is a complete transcription of the audio content...",
      status: "transcribed" as Status,
      userId,
    });

    await mediaRepository.create(media);

    const result = await sut.execute({
      mediaId: media.id,
      userId,
      prompt,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      media: expect.objectContaining({
        id: media.id,
        userId,
        summaryPrompt: prompt,
        status: "pending_summary",
      }),
    });

    expect(queueService.queues["media_summary_queue"]).toHaveLength(1);
  });
});

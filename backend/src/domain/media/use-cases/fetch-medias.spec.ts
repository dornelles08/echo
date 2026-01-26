import { makeMediaFactory } from "@test/factories/make-media";
import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryMediaRepository } from "../../../../test/repositories/in-memory-media.repository";
import { FetchMediasUseCase } from "./fetch-medias";

let inMemoryMediaRepository: InMemoryMediaRepository;
let sut: FetchMediasUseCase;

describe("Fetch Media", () => {
  beforeEach(() => {
    inMemoryMediaRepository = new InMemoryMediaRepository();
    sut = new FetchMediasUseCase(inMemoryMediaRepository);
  });

  it("should be able to fetch medias", async () => {
    const media = makeMediaFactory({
      userId: "user-123",
    });
    await inMemoryMediaRepository.create(media);

    const result = await sut.execute({
      userId: "user-123",
      perPage: 10,
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      medias: expect.arrayContaining([
        expect.objectContaining({
          id: media.id,
          userId: "user-123",
        }),
      ]),
    });
  });

  it("should be able to fetch a media type video", async () => {
    Array.from({ length: 5 }).forEach(async () => {
      const media = makeMediaFactory({
        userId: "user-123",
      });
      await inMemoryMediaRepository.create(media);
    });

    const totalMediasVideo = inMemoryMediaRepository.items.filter((i) => i.type === "video").length;

    const result = await sut.execute({
      userId: "user-123",
      perPage: 10,
      page: 1,
      type: "video",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.medias.length).toBe(totalMediasVideo);
  });

  it("should be able to fetch a media type audio", async () => {
    Array.from({ length: 5 }).forEach(async () => {
      const media = makeMediaFactory({
        userId: "user-123",
      });
      await inMemoryMediaRepository.create(media);
    });

    const totalMediasAudio = inMemoryMediaRepository.items.filter((i) => i.type === "audio").length;

    const result = await sut.execute({
      userId: "user-123",
      perPage: 10,
      page: 1,
      type: "audio",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.medias.length).toBe(totalMediasAudio);
  });

  it("should be able to fetch a media paginated", async () => {
    Array.from({ length: 21 }).forEach(async () => {
      const media = makeMediaFactory({
        userId: "user-123",
      });
      await inMemoryMediaRepository.create(media);
    });

    const result = await sut.execute({
      userId: "user-123",
      perPage: 10,
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.medias.length).toBe(10);
  });

  it("should be able to fetch a media paginated with more than 10 items", async () => {
    Array.from({ length: 21 }).forEach(async () => {
      const media = makeMediaFactory({
        userId: "user-123",
      });
      await inMemoryMediaRepository.create(media);
    });

    const result = await sut.execute({
      userId: "user-123",
      perPage: 10,
      page: 3,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.medias.length).toBe(1);
  });

  it("should be able to fetch a media by status", async () => {
    Array.from({ length: 21 }).forEach(async () => {
      const media = makeMediaFactory({
        userId: "user-123",
      });
      await inMemoryMediaRepository.create(media);
    });

    const result = await sut.execute({
      userId: "user-123",
      perPage: 10,
      page: 1,
      status: "pending",
    });
    const totalMediasPending = inMemoryMediaRepository.items.filter(
      (i) => i.status === "pending",
    ).length;

    expect(result.isRight()).toBe(true);
    expect(result.value?.medias.length).toBe(totalMediasPending);
  });
});

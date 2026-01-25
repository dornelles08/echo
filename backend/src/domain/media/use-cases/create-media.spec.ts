import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryMediaRepository } from "../../../../test/repositories/in-memory-media.repository";
import { CreateMediaUseCase } from "./create-media";

let inMemoryMediaRepository: InMemoryMediaRepository;
let sut: CreateMediaUseCase;

describe("Upload File", () => {
  beforeEach(() => {
    inMemoryMediaRepository = new InMemoryMediaRepository();
    sut = new CreateMediaUseCase(inMemoryMediaRepository);
  });

  it("should be able to create a media", async () => {
    const result = await sut.execute({
      filename: "test-video.mp4",
      url: "http://example.com/test-video.mp4",
      type: "video",
      prompt: "A test video",
      tags: ["test", "video"],
      userId: "user-123",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      media: expect.objectContaining({
        filename: "test-video.mp4",
        url: "http://example.com/test-video.mp4",
        type: "video",
        prompt: "A test video",
        tags: ["test", "video"],
        userId: "user-123",
      }),
    });
  });
});

import { beforeEach, describe, expect, it } from "bun:test";

import { MemoryStorageService } from "../../../../test/services/memory-storage.servive";
import { UploadFileUseCase } from "./upload-file";

let memoryStorageService: MemoryStorageService;
let sut: UploadFileUseCase;

describe("Upload File", () => {
  beforeEach(() => {
    memoryStorageService = new MemoryStorageService();
    sut = new UploadFileUseCase(memoryStorageService);
  });

  it("should upload a file and return its URL", async () => {
    const fileBuffer = Buffer.from("test file content");
    const fileName = "test-file.txt";

    const result = await sut.execute({
      content: fileBuffer,
      filename: fileName,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      file: expect.objectContaining({
        name: fileName,
        url: expect.stringContaining(fileName),
      }),
    });
  });
});

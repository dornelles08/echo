import type { StorageService } from "../../domain/file/services/storage.service";

export class MemoryStorageService implements StorageService {
  saveFile(content: Buffer | Uint8Array, filename: string): Promise<string> {
    return Promise.resolve(`memory:///${filename}`);
  }

  readFile(filePath: string): Promise<Buffer> {
    throw new Error("Method not implemented.");
  }
  deleteFile(filePath: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

import type { StorageService } from "@/domain/file/services/storage.service";
import { env } from "../env";

export class LocalStorageService implements StorageService {
  async saveFile(content: Buffer | Uint8Array, filename: string): Promise<string> {
    filename = `${crypto.randomUUID()}-${filename}`;
    const path = `${env.UPLOAD_DIR}/${filename}`;
    await Bun.write(path, content);

    return path;
  }

  readFile(filePath: string): Promise<Buffer> {
    throw new Error("Method not implemented.");
  }

  deleteFile(filePath: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

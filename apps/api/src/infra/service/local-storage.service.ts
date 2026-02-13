import type { StorageService } from "@echo/core";
import { writeFile } from "node:fs/promises";
import { env } from "../env";

export class LocalStorageService implements StorageService {
  async saveFile(content: Buffer | Uint8Array, filename: string): Promise<string> {
    filename = `${crypto.randomUUID()}-${filename}`;
    const path = `${env.UPLOAD_DIR}/${filename}`;
    await writeFile(path, content);

    return path;
  }

  readFile(filePath: string): Promise<Buffer> {
    throw new Error("Method not implemented.");
  }

  deleteFile(filePath: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export interface StorageService {
  saveFile(content: Buffer | Uint8Array, filename: string): Promise<string>;
  readFile(filePath: string): Promise<Buffer>;
  deleteFile(filePath: string): Promise<void>;
}

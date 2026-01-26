import { type Either, left, right } from "@/core/either";
import { UnknowError } from "@/core/errors/unknow.error";
import { File } from "../entities/File";
import type { StorageService } from "../services/storage.service";

interface UploadFileUseCaseRequest {
  filename: string;
  content: Buffer | Uint8Array;
}

type UploadFileUseCaseResponse = Either<UnknowError, { file: File }>;

export class UploadFileUseCase {
  constructor(private readonly storageService: StorageService) {}

  async execute({
    content,
    filename,
  }: UploadFileUseCaseRequest): Promise<UploadFileUseCaseResponse> {
    try {
      const url = await this.storageService.saveFile(content, filename);
      const file = File.create({ name: filename, url });

      return right({ file });
    } catch (error) {
      return left(new UnknowError(error));
    }
  }
}

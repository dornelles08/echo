import { left, right, type Either } from "@/core/either";
import { UnknownError } from "@/core/errors/unknow.error";
import { File } from "../entities/File";
import type { StorageService } from "../service/storage.service";

interface UploadFileUseCaseRequest {
  filename: string;
  content: Buffer | Uint8Array;
}

type UploadFileUseCaseResponse = Either<UnknownError, { file: File }>;

export class UploadFileUseCase {
  constructor(private readonly storageService: StorageService) {}

  async execute({
    content,
    filename,
  }: UploadFileUseCaseRequest): Promise<UploadFileUseCaseResponse> {
    try {
      const url = await this.storageService.saveFile(content, filename);
      const file = new File({ name: filename, url });

      return right({ file });
    } catch (error) {
      return left(new UnknownError(error));
    }
  }
}

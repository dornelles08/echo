import { UploadFileUseCase } from "@/domain/file/use-cases/upload-file";
import { LocalStorageService } from "@/infra/service/local-storage.service";
import { S3StorageService } from "@/infra/service/s3-storage.service";
import { env } from "@/infra/env";

export function makeUploadFileUseCase() {
  const storageService = env.STORAGE_TYPE === "s3"
    ? new S3StorageService()
    : new LocalStorageService();

  const useCase = new UploadFileUseCase(storageService);

  return useCase;
}

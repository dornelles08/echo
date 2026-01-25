import { UploadFileUseCase } from "@/domain/file/use-cases/upload-file";
import { LocalStorageService } from "@/infra/service/local-storage.service";

export function makeUploadFileUseCase() {
  const localStorageService = new LocalStorageService();
  const useCase = new UploadFileUseCase(localStorageService);

  return useCase;
}

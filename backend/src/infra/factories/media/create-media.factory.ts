import { CreateMediaUseCase } from "@/domain/media/use-cases/create-media";

export function makeCreateMediaUseCase() {
  const mediaRepository = null;
  const useCase = new CreateMediaUseCase(mediaRepository);

  return useCase;
}

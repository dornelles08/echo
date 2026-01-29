import { faker } from "@faker-js/faker";

import { Media, type MediaProps } from "@/domain/media/entities/Media";

export function makeMediaFactory(overrides: Partial<MediaProps> = {}, id?: string) {
  const media = Media.create(
    {
      filename: faker.system.fileName(),
      url: faker.internet.url(),
      type: faker.helpers.arrayElement(["video", "audio"]),
      prompt: faker.lorem.sentence(),
      language: faker.helpers.arrayElement(["en-US", "es-ES", "fr-FR", "de-DE", "pt-BR"]),
      transcription: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(["pending", "processing", "completed", "failed"]),
      tags: faker.helpers.arrayElements(
        ["education", "entertainment", "music", "podcast", "audiobook", "tutorial"],
        { min: 1, max: 3 },
      ),
      userId: faker.string.uuid(),
      ...overrides,
    },
    id,
  );

  return media;
}

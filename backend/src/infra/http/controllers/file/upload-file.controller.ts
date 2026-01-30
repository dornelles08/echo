import type { FastifyReply, FastifyRequest } from "fastify";

import { makeUploadFileUseCase } from "@/infra/factories/file/upload-file.factory";

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
  const data = await request.file();

  if (!data) {
    return reply.status(400).send({ error: "No file uploaded" });
  }

  const buffer = await data.toBuffer();
  const file = new Uint8Array(buffer);
  const filename = data.filename;

  const uploadFileUseCase = makeUploadFileUseCase();

  const result = await uploadFileUseCase.execute({
    content: file,
    filename,
  });

  if (result.isLeft()) {
    const error = result.value;

    switch (error.constructor) {
      default:
        return reply.status(500).send();
    }
  }

  const {
    file: { url, name },
  } = result.value;

  return reply.status(201).send({ url, filename: name });
}

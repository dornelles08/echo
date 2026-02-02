import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { StorageService } from "@/domain/file/services/storage.service";
import { env } from "../env";

export class S3StorageService implements StorageService {
  private readonly client: S3Client;
  private readonly baseUrl: string;

  constructor() {
    this.client = new S3Client({
      endpoint: `http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}`,
      region: env.MINIO_REGION,
      credentials: {
        accessKeyId: env.MINIO_ACCESS_KEY,
        secretAccessKey: env.MINIO_SECRET_KEY,
      },
      forcePathStyle: true,
    });

    const protocol = env.MINIO_USE_SSL ? "https" : "http";
    this.baseUrl = `${protocol}://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${env.MINIO_BUCKET}`;
  }

  async saveFile(content: Buffer | Uint8Array, filename: string): Promise<string> {
    const uniqueFilename = `${crypto.randomUUID()}-${filename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: env.MINIO_BUCKET,
        Key: uniqueFilename,
        Body: content,
      });

      await this.client.send(command);

      return `${this.baseUrl}/${uniqueFilename}`;
    } catch (error) {
      console.error("Error uploading file to MinIO:", error);
      throw new Error("Failed to upload file to storage");
    }
  }

  async readFile(filePath: string): Promise<Buffer> {
    const filename = filePath.split("/").pop();

    if (!filename) {
      throw new Error("Invalid file path");
    }

    try {
      const command = new GetObjectCommand({
        Bucket: env.MINIO_BUCKET,
        Key: filename,
      });

      const response = await this.client.send(command);

      if (!response.Body) {
        throw new Error("File not found");
      }

      const chunks: Uint8Array[] = [];
      const stream = response.Body as any;

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error("Error reading file from MinIO:", error);
      throw new Error("Failed to read file from storage");
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const filename = filePath.split("/").pop();

    if (!filename) {
      throw new Error("Invalid file path");
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: env.MINIO_BUCKET,
        Key: filename,
      });

      await this.client.send(command);
    } catch (error) {
      console.error("Error deleting file from MinIO:", error);
      throw new Error("Failed to delete file from storage");
    }
  }
}

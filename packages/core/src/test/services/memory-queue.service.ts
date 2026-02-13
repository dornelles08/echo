import type { QueueService } from "../../domain/media/services/queue.service";

export class MemoryQueueService implements QueueService {
  queues: Record<string, any[]> = {};

  async publish(
    queueName:
      | "media_conversion_queue"
      | "media_transcription_queue"
      | "media_summary_queue",
    data: any,
  ): Promise<void> {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    this.queues[queueName].push(data);
  }

  async remove(
    queueName:
      | "media_conversion_queue"
      | "media_transcription_queue"
      | "media_summary_queue",
    data: any,
  ): Promise<void> {
    if (!this.queues[queueName]) {
      return;
    }
    this.queues[queueName] = this.queues[queueName].filter(
      (item) => item.data !== data,
    );
  }
}

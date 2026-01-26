import type { QueueService } from "@/domain/media/services/queue.service";
import { getQueue } from "../queue/redis/bullmq-connection";

export class RedisQueueService implements QueueService {
  async publish(
    queueName: "media_conversion_queue" | "media_transcription_queue" | "media_summary_queue",
    data: any,
  ): Promise<void> {
    const queue = getQueue(queueName);

    // O 'name' aqui pode ser o tipo do job, ex: 'process-audio'
    await queue.add("main-job", data);
  }

  async remove(
    queueName: "media_conversion_queue" | "media_transcription_queue" | "media_summary_queue",
    data: any,
  ): Promise<void> {
    const queue = getQueue(queueName);

    await queue.removeJobs(data.jobId);
  }
}

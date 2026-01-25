type QueueName = "media_conversion_queue" | "media_transcription_queue" | "media_summary_queue";

export interface QueueService {
  publish(queueName: QueueName, data: any): Promise<void>;
  remove(queueName: QueueName, data: any): Promise<void>;
}

export type Status =
  | "pending"
  | "peding_transcription"
  | "processing_transcription"
  | "failed_transcription"
  | "transcribed"
  | "pending_summary"
  | "processing_summary"
  | "failed_summary"
  | "summarized"
  | "pending_conversion"
  | "processing_conversion"
  | "failed_conversion"
  | "completed";

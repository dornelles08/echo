export type Status =
  | "peding_transcription"
  | "processing_transcription"
  | "failed_transcription"
  | "transcribed"
  | "pending_conversion"
  | "processing_conversion"
  | "failed_conversion"
  | "pending_summary"
  | "processing_summary"
  | "failed_summary"
  | "summarized";

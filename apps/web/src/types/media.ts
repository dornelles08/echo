export type MediaType = "video" | "audio";

export type MediaStatus =
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

export type Segment = {
	id: number;
	start: number;
	end: number;
	text: string;
	avg_logprob: number;
	compression_ratio: number;
	no_speech_prob: number;
};

export interface Media {
	id: string;
	filename: string;
	url: string;
	type?: "video" | "audio";
	prompt?: string;
	language: string;
	transcription?: string;
	duration: number;
	summary?: string;
	summaryPrompt?: string;
	status: MediaStatus;
	tags: string[];
	segments: Segment[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface PaginationInfo {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

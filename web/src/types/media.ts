export type MediaType = "video" | "audio";

export type MediaStatus =
	| "completed"
	| "processing"
	| "transcribing"
	| "pending"
	| "error";

export interface Media {
	id: string;
	filename: string;
	url: string;
	type: "video" | "audio";
	prompt?: string;
	transcription?: string;
	status: MediaStatus;
	tags: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface PaginationInfo {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

export type MediaType = "video" | "audio";

export type MediaStatus =
	| "completed"
	| "processing"
	| "transcribing"
	| "waiting"
	| "error";

export interface Media {
	id: string;
	name: string;
	type: MediaType;
	status: MediaStatus;
	duration: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface PaginationInfo {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Media, PaginationInfo } from "@/types/media";

interface GetMediasParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
}

interface GetMediasResponse {
	medias: Media[];
	pagination: PaginationInfo;
}

export function useMedias(params: GetMediasParams = {}) {
	return useQuery({
		queryKey: ["medias", params],
		queryFn: async (): Promise<GetMediasResponse> => {
			const response = await api.get("/medias", { params });
			return response.data;
		},
		staleTime: 1000 * 60, // 1 minuto
	});
}

export function useMedia(id: string) {
	return useQuery({
		queryKey: ["media", id],
		queryFn: async (): Promise<Media> => {
			const response = await api.get(`/medias/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
}

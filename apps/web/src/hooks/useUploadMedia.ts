import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { MediaType } from "@/types/media";

interface UploadFileResponse {
	url: string;
	filename: string;
}

interface CreateMediaPayload {
	filename: string;
	url: string;
	type: MediaType;
	language?: string;
	duration?: number;
	tags: string[];
	prompt?: string;
}

// Hook para upload de arquivo
export function useUploadFile() {
	return useMutation({
		mutationFn: async (file: File): Promise<UploadFileResponse> => {
			const formData = new FormData();
			formData.append("file", file);

			const response = await api.post("/files/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return response.data;
		},
	});
}

// Hook para criar mídia
export function useCreateMedia() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateMediaPayload) => {
			const response = await api.post("/medias", payload);
			return response.data;
		},
		onSuccess: () => {
			// Invalida o cache de mídias para refazer a query
			queryClient.invalidateQueries({ queryKey: ["medias"] });
		},
	});
}

// Hook combinado que faz upload e criação em sequência
export function useUploadAndCreateMedia() {
	const uploadFile = useUploadFile();
	const createMedia = useCreateMedia();

	return useMutation({
		mutationFn: async ({
			file,
			type,
			language,
			duration,
			tags,
			prompt,
		}: {
			file: File;
			type: MediaType;
			language?: string;
			tags: string[];
			duration?: number;
			prompt?: string;
		}) => {
			
			// 1. Faz upload do arquivo
			const uploadResult = await uploadFile.mutateAsync(file);
			
			console.log({
				filename: uploadResult.filename,
				url: uploadResult.url,
				type,
				language,
				duration,
				tags,
				prompt,
			});
			
			// 2. Cria a mídia com os dados do upload
			const mediaResult = await createMedia.mutateAsync({
				filename: uploadResult.filename,
				url: uploadResult.url,
				type,
				language,
				duration,
				tags,
				prompt,
			});

			return mediaResult;
		},
	});
}

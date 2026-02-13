import { useNavigate, useSearch } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTags } from "@/hooks/useMedia";
import type { MediaStatus, MediaType } from "@/types/media";

const mediaTypes: { value: MediaType | "all"; label: string }[] = [
	{ value: "all", label: "Todos os tipos" },
	{ value: "video", label: "Vídeo" },
	{ value: "audio", label: "Áudio" },
];

const statusOptions: { value: MediaStatus | "all"; label: string }[] = [
	{ value: "all", label: "Todos os status" },
	{ value: "summarized", label: "Resumo Gerado" },
	{ value: "processing_summary", label: "Processando Resumo" },
	{ value: "processing_transcription", label: "Transcrevendo" },
	{ value: "pending_transcription", label: "Aguardando Transcrição" },
	{ value: "failed_transcription", label: "Erro na Transcrição" },
	{ value: "failed_summary", label: "Erro no Resumo" },
];

interface FiltersFormData {
	type: MediaType | "all";
	status: MediaStatus | "all";
	tags: string[];
}

interface MediaFiltersProps {
	onClose?: () => void;
}

export function MediaFilters({ onClose }: MediaFiltersProps) {
	const navigate = useNavigate();
	const search = useSearch({ from: "/_authenticate/dashboard/" });
	const { data: availableTags, isLoading: isLoadingTags } = useTags();

	const currentType = (search.type as MediaType | "all") || "all";
	const currentStatus = (search.status as MediaStatus | "all") || "all";
	const currentTags = search.tags ? (search.tags as string).split(",") : [];

	const { handleSubmit, watch, setValue, reset } = useForm<FiltersFormData>({
		defaultValues: {
			type: currentType,
			status: currentStatus,
			tags: currentTags,
		},
	});

	const watchedType = watch("type");
	const watchedStatus = watch("status");
	const watchedTags = watch("tags");

	const handleTagToggle = (tag: string) => {
		const currentTags = watchedTags || [];
		let newTags: string[];

		if (currentTags.includes(tag)) {
			// Remove tag
			newTags = currentTags.filter((t) => t !== tag);
		} else {
			// Adiciona tag
			newTags = [...currentTags, tag];
		}

		setValue("tags", newTags);
	};

	const onSubmit = (data: FiltersFormData) => {
		const searchParams: {
			page: number;
			type?: string;
			status?: string;
			tags?: string;
		} = { page: 1 };

		// Adiciona apenas filtros que não são "all" ou vazios
		if (data.type && data.type !== "all") {
			searchParams.type = data.type;
		}
		if (data.status && data.status !== "all") {
			searchParams.status = data.status;
		}
		if (data.tags && data.tags.length > 0) {
			searchParams.tags = data.tags.join(",");
		}

		navigate({
			to: "/dashboard",
			search: searchParams,
		});

		if (onClose) {
			onClose();
		}
	};

	const clearAllFilters = () => {
		reset({
			type: "all",
			status: "all",
			tags: [],
		});
	};

	const hasActiveFilters =
		watchedType !== "all" ||
		watchedStatus !== "all" ||
		(watchedTags && watchedTags.length > 0);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold text-stone-900 dark:text-white">
					Filtros
				</h3>
				{onClose && (
					<button
						onClick={onClose}
						className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
						type="button"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* Tipo de Mídia */}
			<div>
				<Label className="text-stone-900 dark:text-white mb-2 block">
					Tipo de Mídia
				</Label>
				<Select
					value={watchedType}
					onValueChange={(value) =>
						setValue("type", value as MediaType | "all")
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{mediaTypes.map((type) => (
							<SelectItem key={type.value} value={type.value}>
								{type.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Status */}
			<div>
				<Label className="text-stone-900 dark:text-white mb-2 block">
					Status
				</Label>
				<Select
					value={watchedStatus}
					onValueChange={(value) =>
						setValue("status", value as MediaStatus | "all")
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{statusOptions.map((status) => (
							<SelectItem key={status.value} value={status.value}>
								{status.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Tags */}
			<div>
				<Label className="text-stone-900 dark:text-white mb-2 block">
					Tags
				</Label>
				{isLoadingTags ? (
					<div className="flex flex-wrap gap-2">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="h-7 w-16 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse"
							/>
						))}
					</div>
				) : (
					<div className="flex flex-wrap gap-2">
						{availableTags?.map((tag) => {
							const isSelected = watchedTags?.includes(tag);
							return (
								<button
									key={tag}
									type="button"
									onClick={() => handleTagToggle(tag)}
									className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
										isSelected
											? "bg-teal-600 text-white hover:bg-teal-700"
											: "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
									}`}
								>
									{tag}
								</button>
							);
						})}
						{(!availableTags || availableTags.length === 0) && (
							<p className="text-sm text-stone-500 dark:text-stone-400">
								Nenhuma tag encontrada
							</p>
						)}
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-700">
				{hasActiveFilters && (
					<button
						onClick={clearAllFilters}
						className="w-full px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
						type="button"
					>
						Limpar todos os filtros
					</button>
				)}

				<Button
					type="submit"
					className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium"
				>
					Filtrar
				</Button>
			</div>
		</form>
	);
}

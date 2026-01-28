import { useNavigate, useSearch } from "@tanstack/react-router";
import { X } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { MediaStatus, MediaType } from "@/types/media";

const mediaTypes: { value: MediaType | "all"; label: string }[] = [
	{ value: "all", label: "Todos os tipos" },
	{ value: "video", label: "Vídeo" },
	{ value: "audio", label: "Áudio" },
];

const statusOptions: { value: MediaStatus | "all"; label: string }[] = [
	{ value: "all", label: "Todos os status" },
	{ value: "completed", label: "Resumo Gerado" },
	{ value: "processing", label: "Processando IA" },
	{ value: "transcribing", label: "Transcrevendo" },
	{ value: "pending", label: "Aguardando" },
	{ value: "error", label: "Erro" },
];

const availableTags = [
	"#marketing",
	"#estratégia",
	"#rh",
	"#ux",
	"#design",
	"#suporte",
	"#vendas",
	"#produto",
];

interface MediaFiltersProps {
	onClose?: () => void;
}

export function MediaFilters({ onClose }: MediaFiltersProps) {
	const navigate = useNavigate();
	const search = useSearch({ from: "/_authenticate/dashboard/" });

	const currentType = (search.type as MediaType | "all") || "all";
	const currentStatus = (search.status as MediaStatus | "all") || "all";
	const currentTags = search.tags ? (search.tags as string).split(",") : [];

	const updateFilters = (updates: Partial<typeof search>) => {
		const newSearch = { ...search, ...updates };

		// Remove filtros com valor 'all' ou vazios
		(Object.keys(newSearch) as Array<keyof typeof newSearch>).forEach((key) => {
			if (
				newSearch[key] === "all" ||
				newSearch[key] === "" ||
				newSearch[key] === undefined
			) {
				delete newSearch[key];
			}
		});

		// Reset para página 1 quando mudar filtros
		navigate({
			to: "/dashboard",
			search: { ...newSearch, page: 1 },
		});
	};

	const handleTypeChange = (value: string) => {
		updateFilters({ type: value === "all" ? undefined : value });
	};

	const handleStatusChange = (value: string) => {
		updateFilters({ status: value === "all" ? undefined : value });
	};

	const handleTagToggle = (tag: string) => {
		let newTags: string[];

		if (currentTags.includes(tag)) {
			// Remove tag
			newTags = currentTags.filter((t) => t !== tag);
		} else {
			// Adiciona tag
			newTags = [...currentTags, tag];
		}

		updateFilters({
			tags: newTags.length > 0 ? newTags.join(",") : undefined,
		});
	};

	const clearAllFilters = () => {
		navigate({
			to: "/dashboard",
			search: { page: 1 },
		});
	};

	const hasActiveFilters =
		currentType !== "all" || currentStatus !== "all" || currentTags.length > 0;

	return (
		<div className="space-y-6">
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
				<Select value={currentType} onValueChange={handleTypeChange}>
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
				<Select value={currentStatus} onValueChange={handleStatusChange}>
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
				<div className="flex flex-wrap gap-2">
					{availableTags.map((tag) => {
						const isSelected = currentTags.includes(tag);
						return (
							<button
								key={tag}
								onClick={() => handleTagToggle(tag)}
								className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
									isSelected
										? "bg-teal-600 text-white hover:bg-teal-700"
										: "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
								}`}
								type="button"
							>
								{tag}
							</button>
						);
					})}
				</div>
			</div>

			{/* Limpar Filtros */}
			{hasActiveFilters && (
				<button
					onClick={clearAllFilters}
					className="w-full px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
					type="button"
				>
					Limpar todos os filtros
				</button>
			)}
		</div>
	);
}

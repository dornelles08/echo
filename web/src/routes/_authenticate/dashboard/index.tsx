import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { ArrowUpDown, Filter } from "lucide-react";
import { useState } from "react";
import z from "zod";

import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMedias } from "@/hooks/useMedia";
import type { Media } from "@/types/media";
import { MediaFilters } from "../-components/MediaFilters";
import { MediaTable } from "../-components/MediaTable";

export const Route = createFileRoute("/_authenticate/dashboard/")({
	component: RouteComponent,
	validateSearch: (search) => dashboardSearchSchema.parse(search),
});

const dashboardSearchSchema = z.object({
	page: z.number().optional().default(1),
	type: z.string().optional(),
	status: z.string().optional(),
	tags: z.string().optional(),
	search: z.string().optional(),
});

function RouteComponent() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/_authenticate/dashboard/" });
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const currentPage = (search.page as number) || 1;
	const currentType = search.type as string | undefined;
	const currentStatus = search.status as string | undefined;
	const currentTags = search.tags
		? (search.tags as string).split(",").filter(Boolean)
		: [];

	const { data, isLoading, isError } = useMedias({
		page: currentPage,
		status: currentStatus,
		type: currentType,
		tags: currentTags,
	});

	function handleMediaClick(media: Media) {
		navigate({ to: `/dashboard/media/${media.id}` });
	}

	const handlePageChange = (page: number) => {
		navigate({
			to: "/dashboard",
			search: { ...search, page },
		});
	};

	const activeFiltersCount = [currentType, currentStatus, currentTags].filter(
		(f) => f && f.length > 0,
	).length;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-stone-600 dark:text-stone-400">Carregando...</div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-red-600 dark:text-red-400">
					Erro ao carregar mídias. Tente novamente.
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Header da página */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-stone-900 dark:text-white mb-2">
					Minhas Mídias
				</h1>
				<p className="text-stone-600 dark:text-stone-400">
					Gerencie suas gravações e transcrições geradas por IA.
				</p>
			</div>

			{/* Filtros e Ordenação */}
			<div className="flex items-center justify-end gap-3 mb-6">
				<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 gap-2 relative"
						>
							<Filter className="w-4 h-4" />
							Filtrar
							{activeFiltersCount > 0 && (
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
									{activeFiltersCount}
								</span>
							)}
						</Button>
					</SheetTrigger>
					<SheetContent>
						<MediaFilters onClose={() => setIsFilterOpen(false)} />
					</SheetContent>
				</Sheet>

				<Button
					variant="outline"
					className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 gap-2"
				>
					<ArrowUpDown className="w-4 h-4" />
					Ordenar
				</Button>
			</div>

			{/* Tabela de Mídias */}
			<MediaTable medias={data.medias} onMediaClick={handleMediaClick} />

			{/* Paginação */}
			<Pagination
				pagination={data.pagination}
				onPageChange={handlePageChange}
			/>
		</>
	);
}

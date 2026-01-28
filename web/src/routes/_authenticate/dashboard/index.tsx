import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUpDown, Filter } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import type { Media } from "@/types/media";
import { MediaTable } from "../-components/MediaTable";

export const Route = createFileRoute("/_authenticate/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);

	// Dados mock enquanto o backend não está pronto
	const mockData = {
		medias: [
			{
				id: "1",
				name: "Reunião_Mensal_Q3.mp4",
				type: "video" as const,
				status: "completed" as const,
				duration: "45:12",
				tags: ["#marketing", "#estratégia"],
				createdAt: "2024-01-20",
				updatedAt: "2024-01-20",
			},
			{
				id: "2",
				name: "Entrevista_Candidato_UX.wav",
				type: "audio" as const,
				status: "transcribing" as const,
				duration: "12:05",
				tags: ["#rh", "#ux"],
				createdAt: "2024-01-21",
				updatedAt: "2024-01-21",
			},
			{
				id: "3",
				name: "Workshop_Design_Systems.mp4",
				type: "video" as const,
				status: "processing" as const,
				duration: "1:24:45",
				tags: ["#design"],
				createdAt: "2024-01-22",
				updatedAt: "2024-01-22",
			},
			{
				id: "4",
				name: "Chamada_Suporte_092.m4a",
				type: "audio" as const,
				status: "waiting" as const,
				duration: "04:18",
				tags: ["#suporte"],
				createdAt: "2024-01-23",
				updatedAt: "2024-01-23",
			},
		],
		pagination: {
			currentPage: 1,
			totalPages: 3,
			totalItems: 12,
			itemsPerPage: 4,
		},
	};

	// Quando o backend estiver pronto, descomente isso:
	// const { data, isLoading, isError } = useMedias({ page: currentPage });

	const handleMediaClick = (media: Media) => {
		navigate({ to: `/dashboard/media/${media.id}` });
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

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
				<Button
					variant="outline"
					className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 gap-2"
				>
					<Filter className="w-4 h-4" />
					Filtrar
				</Button>
				<Button
					variant="outline"
					className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 gap-2"
				>
					<ArrowUpDown className="w-4 h-4" />
					Ordenar
				</Button>
			</div>

			{/* Tabela de Mídias */}
			<MediaTable medias={mockData.medias} onMediaClick={handleMediaClick} />

			{/* Paginação */}
			<Pagination
				pagination={mockData.pagination}
				onPageChange={handlePageChange}
			/>
		</>
	);
}

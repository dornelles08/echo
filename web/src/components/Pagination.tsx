import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaginationInfo } from "@/types/media";

interface PaginationProps {
	pagination: PaginationInfo;
	onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
	const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<div className="flex items-center justify-between mt-6">
			<p className="text-sm text-stone-600 dark:text-stone-400">
				Mostrando {startItem} a {endItem} de {totalItems} arquivos
			</p>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
				>
					<ChevronLeft className="w-4 h-4 mr-1" />
					Anterior
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
				>
					Próximo
					<ChevronRight className="w-4 h-4 ml-1" />
				</Button>
			</div>
		</div>
	);
}

import { cn } from "@/lib/utils";
import type { MediaStatus } from "@/types/media";

interface StatusBadgeProps {
	status: MediaStatus;
}

const statusConfig = {
	completed: {
		label: "Resumo Gerado",
		className: "bg-green-500/10 text-green-400 border-green-500/20",
	},
	processing: {
		label: "Processando IA",
		className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
	},
	transcribing: {
		label: "Transcrevendo...",
		className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
	},
	pending: {
		label: "Aguardando",
		className: "bg-stone-500/10 text-stone-400 border-stone-500/20",
	},
	error: {
		label: "Erro",
		className: "bg-red-500/10 text-red-400 border-red-500/20",
	},
};

export function StatusBadge({ status }: StatusBadgeProps) {
	const config = statusConfig[status];

	return (
		<span
			className={cn(
				"inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
				config.className,
			)}
		>
			{config.label}
		</span>
	);
}

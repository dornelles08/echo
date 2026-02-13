import { CloudUpload, Plus } from "lucide-react";

interface EmptyStateSectionProps {
	onOpenCreateMedia: () => void;
}

export function EmptyStateSection({
	onOpenCreateMedia,
}: EmptyStateSectionProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-8">
			<div className="text-center max-w-md">
				{/* Icon */}
				<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center">
					<CloudUpload className="w-8 h-8 text-teal-600" />
				</div>

				{/* Message */}
				<h3 className="text-xl font-semibold text-stone-900 dark:text-white mb-3">
					Nenhuma mídia encontrada
				</h3>
				<p className="text-stone-600 dark:text-stone-400 mb-8 text-center leading-relaxed">
					Comece adicionando suas primeiras mídias para transcrever e gerar
					resumos usando IA.
				</p>

				{/* CTA Button */}
				<button
					onClick={onOpenCreateMedia}
					className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
				>
					<Plus className="w-4 h-4 mr-2" />
					Adicionar primeira mídia
				</button>
			</div>
		</div>
	);
}

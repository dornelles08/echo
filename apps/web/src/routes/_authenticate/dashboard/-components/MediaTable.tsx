import type { Media } from "@/types/media";
import { MediaTableRow } from "./MediaTableRow";

interface MediaTableProps {
	medias: Media[];
	onMediaClick?: (media: Media) => void;
}

export function MediaTable({ medias, onMediaClick }: MediaTableProps) {
	return (
		<div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
							<th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
								Nome do arquivo
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
								Tipo
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
								Duração
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
								Tags
							</th>
						</tr>
					</thead>
					<tbody>
						{medias.length === 0 ? (
							<tr>
								<td colSpan={5} className="px-6 py-12 text-center">
									<p className="text-stone-500 dark:text-stone-500">
										Nenhuma mídia encontrada
									</p>
								</td>
							</tr>
						) : (
							medias.map((media) => (
								<MediaTableRow
									key={media.id}
									media={media}
									onClick={() => onMediaClick?.(media)}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

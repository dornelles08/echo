import { FileIcon } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { formatDuration } from "@/lib/duration";
import type { Media } from "@/types/media";
import { MediaIcon } from "./MediaIcon";

interface MediaTableRowProps {
	media: Media;
	onClick?: () => void;
}

export function MediaTableRow({ media, onClick }: MediaTableRowProps) {
	return (
		<tr
			onClick={onClick}
			className="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/30 cursor-pointer transition-colors group"
		>
			{/* Nome do arquivo */}
			<td className="px-6 py-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
						<FileIcon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
					</div>
					<span className="text-sm font-medium text-stone-900 dark:text-white">
						{media.filename}
					</span>
				</div>
			</td>

			{/* Tipo */}
			<td className="px-6 py-4 flex">
				<MediaIcon type={media.type} />
			</td>

			{/* Duração */}
			<td className="px-6 py-4">
				<span className="text-sm font-medium text-stone-900 dark:text-white">
					{formatDuration(media.duration)}
				</span>
			</td>

			{/* Status */}
			<td className="px-6 py-4">
				<StatusBadge status={media.status} />
			</td>

			{/* Tags */}
			<td className="px-6 py-4">
				<div className="flex items-center gap-2 flex-wrap">
					{media.tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center px-2 py-0.5 rounded text-xs text-stone-600 dark:text-stone-400"
						>
							{tag}
						</span>
					))}
				</div>
			</td>
		</tr>
	);
}

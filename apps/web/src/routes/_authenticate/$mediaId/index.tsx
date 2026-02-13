import { createFileRoute, useParams } from "@tanstack/react-router";
import { Clock, Globe, Tag } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { COMMON_LANGUAGES } from "@/config/constantes";
import { useMedia } from "@/hooks/useMedia";
import { formatDuration } from "@/lib/duration";
import { SummaryPanel } from "./-components/SummaryPanel";
import { TranscriptionList } from "./-components/TranscriptionList";

export const Route = createFileRoute("/_authenticate/$mediaId/")({
	component: MediaDetailsPage,
});

export default function MediaDetailsPage() {
	const { mediaId } = useParams({ from: "/_authenticate/$mediaId/" });
	const [currentTime, setCurrentTime] = useState(0);
	const { data, isError, isLoading } = useMedia(mediaId);

	if (isLoading) {
		return <div>Carregando...</div>;
	}

	if (isError) {
		return <div>Erro ao carregar mídia</div>;
	}

	const media = data?.media;

	if (!media) {
		return <div>Erro ao carregar mídia</div>;
	}

	const languague = COMMON_LANGUAGES.find(
		({ code }) => code === media.language,
	);

	const handleSeek = (time: number) => {
		setCurrentTime(time);
		// TODO: Implementar seek no player quando disponível
		console.log("Seek to:", time);
	};

	const handleGenerateSummary = (template: string, instructions?: string) => {
		console.log("Generate summary:", { template, instructions });
		// TODO: Implementar geração de resumo
	};

	return (
		<div className="h-full flex flex-col">
			{/* Header da mídia */}
			<div className="px-8 pb-6 border-b border-stone-200 dark:border-stone-800">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
							{media.filename}
						</h1>
						<div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
							<div className="flex items-center gap-1.5">
								<Clock className="w-4 h-4" />
								{formatDuration(media.duration)}
							</div>
							<div className="flex items-center gap-1.5">
								<Globe className="w-4 h-4" />
								{languague?.name || media.language}
							</div>
						</div>
					</div>
					<StatusBadge status={media.status} />
				</div>

				{/* Tags */}
				<div className="flex items-center gap-2">
					<Tag className="w-4 h-4 text-stone-500" />
					<div className="flex flex-wrap gap-2">
						{media.tags.map((tag) => (
							<span
								key={tag}
								className="px-2 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs rounded-full"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Conteúdo principal */}
			<div className="flex-1 overflow-hidden grid grid-cols-2 divide-x divide-stone-200 dark:divide-stone-800">
				{/* Coluna esquerda: Player + Transcrição */}
				<div className="flex flex-col overflow-hidden">
					{/* Player */}
					{/* <div className="p-6 border-b border-stone-200 dark:border-stone-800">
						<MediaPlayer media={media} onSeek={handleSeek} />
					</div> */}

					{/* Transcrição */}
					<div className="flex-1 overflow-hidden">
						<TranscriptionList
							segments={media.segments || []}
							onSeek={handleSeek}
						/>
					</div>
				</div>

				{/* Coluna direita: Resumo */}
				<div className="flex flex-col overflow-hidden">
					<SummaryPanel
						summary={media.summary}
						onGenerate={handleGenerateSummary}
					/>
				</div>
			</div>
		</div>
	);
}

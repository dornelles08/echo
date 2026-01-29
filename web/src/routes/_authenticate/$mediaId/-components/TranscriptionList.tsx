import { Search } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  isSignificantPause,
  type TranscriptionSegment,
} from "@/types/transcription";
import { PauseMarker } from "./PauseMarker";
import { TranscriptionSegmentItem } from "./TranscriptionSegmentItem";

interface TranscriptionListProps {
	segments: TranscriptionSegment[];
	onSeek?: (time: number) => void;
}

export function TranscriptionList({
	segments,
	onSeek,
}: TranscriptionListProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// Filtra segmentos baseado na busca
	const filteredSegments = segments.filter((segment) =>
		segment.text.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex flex-col h-full">
			{/* Campo de busca */}
			<div className="p-4 border-b border-stone-200 dark:border-stone-800">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
					<Input
						type="search"
						placeholder="Pesquisar na transcrição..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				{searchQuery && (
					<p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
						{filteredSegments.length} resultado
						{filteredSegments.length !== 1 ? "s" : ""} encontrado
						{filteredSegments.length !== 1 ? "s" : ""}
					</p>
				)}
			</div>

			{/* Lista de segmentos */}
			<div className="flex-1 overflow-y-auto">
				{filteredSegments.length === 0 ? (
					<div className="flex items-center justify-center h-full text-stone-500 dark:text-stone-400">
						<p className="text-sm">
							{searchQuery
								? "Nenhum resultado encontrado"
								: "Nenhum segmento disponível"}
						</p>
					</div>
				) : (
					<div className="py-2">
						{filteredSegments.map((segment, index) => {
							const nextSegment = filteredSegments[index + 1];
							const showPause =
								nextSegment && isSignificantPause(segment.no_speech_prob);

							return (
								<div key={segment.id}>
									<TranscriptionSegmentItem segment={segment} onSeek={onSeek} />
									{showPause && <PauseMarker />}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

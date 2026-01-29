import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatTimestamp,
  getSegmentDuration,
  getSegmentQuality,
  type TranscriptionSegment,
} from "@/types/transcription";
import { QualityIndicator } from "./QualityIndicator";

interface TranscriptionSegmentItemProps {
	segment: TranscriptionSegment;
	onSeek?: (time: number) => void;
}

export function TranscriptionSegmentItem({
	segment,
	onSeek,
}: TranscriptionSegmentItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const quality = getSegmentQuality(segment.avg_logprob);
	const duration = getSegmentDuration(segment.start, segment.end);

	const handleClick = () => {
		if (onSeek) {
			onSeek(segment.start);
		}
	};

	return (
		<div
			className="group py-3 px-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-lg transition-colors cursor-pointer"
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
		>
			<div className="flex items-start gap-3">
				{/* Indicador de qualidade */}
				<div className="shrink-0 mt-1">
					<QualityIndicator quality={quality} />
				</div>

				{/* Conteúdo */}
				<div className="flex-1 min-w-0">
					{/* Timestamp */}
					<div className="flex items-center gap-2 mb-1">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										className="text-xs font-mono text-teal-600 dark:text-teal-400 hover:underline"
										onClick={(e) => {
											e.stopPropagation();
											handleClick();
										}}
										type="button"
									>
										{formatTimestamp(segment.start)}
									</button>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-xs">Clique para ir para este momento</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{/* Info adicional no hover */}
						{isHovered && (
							<span className="text-xs text-stone-400">• {duration}</span>
						)}
					</div>

					{/* Texto com tooltip inteligente */}
					<TooltipProvider>
						<Tooltip delayDuration={500}>
							<TooltipTrigger asChild>
								<p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
									{segment.text}
								</p>
							</TooltipTrigger>
							<TooltipContent className="max-w-sm">
								<div className="space-y-2">
									<div>
										<p className="text-xs font-semibold mb-1">
											Informações do segmento
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs">
											<span className="text-stone-400">Duração:</span>{" "}
											<span className="font-medium">{duration}</span>
										</p>
										<p className="text-xs">
											<span className="text-stone-400">Confiança:</span>{" "}
											<span className="font-medium">
												{quality === "high" && "Alta"}
												{quality === "medium" && "Média"}
												{quality === "low" && "Baixa"}
											</span>
										</p>
										{quality === "low" && (
											<p className="text-xs text-yellow-600 dark:text-yellow-400">
												⚠️ Este trecho pode conter imprecisões
											</p>
										)}
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}

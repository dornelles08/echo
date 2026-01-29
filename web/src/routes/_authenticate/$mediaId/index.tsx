import { createFileRoute, useParams } from "@tanstack/react-router";
import { Clock, Globe, Tag } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { MediaPlayer } from "./-components/MediaPlayer";
import { SummaryPanel } from "./-components/SummaryPanel";
import { TranscriptionList } from "./-components/TranscriptionList";

export const Route = createFileRoute("/_authenticate/$mediaId/")({
	component: MediaDetailsPage,
});

export default function MediaDetailsPage() {
	const { mediaId } = useParams({ from: "/_authenticate/$mediaId/" });
	const [currentTime, setCurrentTime] = useState(0);

	// Dados mock - substituir por useQuery quando backend estiver pronto
	const mockMedia = {
		id: mediaId,
		filename: "Entrevista_Design_Review.mp4",
		url: "https://example.com/video.mp4",
		type: "video" as const,
		status: "completed" as const,
		duration: "42:15",
		tags: ["#design", "#review", "#ux"],
		prompt: "Entrevista sobre design systems",
		transcription: "Transcrição completa aqui...",
		summary: `# Resumo da Reunião: Echo Design Review

*Gerado em 24 de Maio, 2024*

## Visão Geral

A discussão focou na interface de usuário (UI) da aplicação Echo, especificamente na tela de detalhes que combina transcrição e resumo de IA.

## Principais Tópicos

### Layout Split-Screen
Implementação de uma tela dividida para diferenciar claramente entre a transcrição bruta e o processamento de IA.

### Experiência do Usuário
Necessidade de indicadores claros para falantes e marcas de tempo.

### Ações de Saída
Inclusão de exportações diretas para facilitar o fluxo de trabalho pós-reunião.

## Próximos Passos

1. Implementar botões de download para PDF e Markdown.
2. Ajustar o contraste da paleta de cores (Verde Echo e Bege Arena).
3. Testar o carregamento dinâmico de transcrições longas.

> "O fluxo de trabalho deve ser o mais fluido possível."`,
		segments: [
			{
				id: 1,
				start: 0.0,
				end: 12.48,
				text: "Olá a todos, obrigado por participarem desta sessão de revisão de design. Hoje vamos focar especificamente na interface do projeto Echo e como estamos lidando com a experiência do usuário para transcrições e resumos de IA.",
				temperature: 0.0,
				avg_logprob: -0.15,
				compression_ratio: 1.45,
				no_speech_prob: 0.01,
			},
			{
				id: 2,
				start: 12.48,
				end: 18.92,
				text: "Ótimo começo. Eu notei que na tela de detalhes, precisamos garantir que o usuário consiga distinguir rapidamente entre o que é o texto original e o que é o resumo gerado pela inteligência artificial. Como estamos diferenciando isso visualmente?",
				temperature: 0.0,
				avg_logprob: -0.25,
				compression_ratio: 1.38,
				no_speech_prob: 0.03,
			},
			{
				id: 3,
				start: 18.92,
				end: 28.15,
				text: "Essa é uma excelente pergunta. Estamos planejando um layout de tela dividida. À esquerda, teremos a transcrição bruta com timestamps e rótulos de falante. À direita, reservaremos o espaço para as ferramentas de resumo e a visualização em Markdown do conteúdo processado.",
				temperature: 0.0,
				avg_logprob: -0.18,
				compression_ratio: 1.42,
				no_speech_prob: 0.02,
			},
			{
				id: 4,
				start: 28.15,
				end: 35.67,
				text: "E sobre as opções de exportação? Seria muito útil ter PDF e Markdown direto na tela de resumo. Muitos usuários vão querer levar esse conteúdo para o Notion ou Slack.",
				temperature: 0.0,
				avg_logprob: -0.45,
				compression_ratio: 1.28,
				no_speech_prob: 0.15,
			},
			{
				id: 5,
				start: 35.67,
				end: 42.15,
				text: "Com certeza, vamos incluir botões de ação rápida logo abaixo do preview. A ideia é que o fluxo de trabalho seja o mais fluido possível.",
				temperature: 0.0,
				avg_logprob: -0.22,
				compression_ratio: 1.35,
				no_speech_prob: 0.05,
			},
		],
		createdAt: "2024-01-20",
		updatedAt: "2024-01-20",
	};

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
			<div className="px-8 py-6 border-b border-stone-200 dark:border-stone-800">
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
							{mockMedia.filename}
						</h1>
						<div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
							<div className="flex items-center gap-1.5">
								<Clock className="w-4 h-4" />
								{mockMedia.duration}
							</div>
							<div className="flex items-center gap-1.5">
								<Globe className="w-4 h-4" />
								Português (BR)
							</div>
						</div>
					</div>
					<StatusBadge status={mockMedia.status} />
				</div>

				{/* Tags */}
				<div className="flex items-center gap-2">
					<Tag className="w-4 h-4 text-stone-500" />
					<div className="flex flex-wrap gap-2">
						{mockMedia.tags.map((tag) => (
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
					<div className="p-6 border-b border-stone-200 dark:border-stone-800">
						<MediaPlayer media={mockMedia} onSeek={handleSeek} />
					</div>

					{/* Transcrição */}
					<div className="flex-1 overflow-hidden">
						<TranscriptionList
							segments={mockMedia.segments || []}
							onSeek={handleSeek}
						/>
					</div>
				</div>

				{/* Coluna direita: Resumo */}
				<div className="flex flex-col overflow-hidden">
					<SummaryPanel
						summary={mockMedia.summary}
						onGenerate={handleGenerateSummary}
					/>
				</div>
			</div>
		</div>
	);
}

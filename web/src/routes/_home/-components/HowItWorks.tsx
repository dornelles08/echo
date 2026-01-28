/** biome-ignore-all lint/correctness/useUniqueElementIds: Uso para navegação */
import { FileDown, Sparkles, Upload } from "lucide-react";
import { ProcessCard } from "./ProcessCard";

export function HowItWorks() {
	return (
		<section id="funciona" className="py-20 px-4 bg-white dark:bg-stone-950">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
						Como o Echo funciona
					</h2>
					<p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
						Um processo simples e rápido para transformar suas gravações em
						conteúdo indexado.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					<ProcessCard
						icon={Upload}
						step="1"
						title="Upload"
						description="Envie seus arquivos de áudio ou vídeo para a nuvem. Suportamos MP3, MP4, WAV e muitos outros formatos."
						iconColor="teal"
					/>

					<ProcessCard
						icon={Sparkles}
						step="2"
						title="IA Processamento"
						description="Nossa IA trabalha com 99% de precisão e identifica os principais tópicos e palavras-chave."
						iconColor="orange"
					/>

					<ProcessCard
						icon={FileDown}
						step="3"
						title="Insight e Export"
						description="Acesse seu texto inteligente, pontos principais e exporte em PDF."
						iconColor="stone"
					/>
				</div>
			</div>
		</section>
	);
}

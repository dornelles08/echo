import { ChevronDown, Copy, Download, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SummaryPanelProps {
	summary?: string;
	onGenerate: (template: string, instructions?: string) => void;
	isGenerating?: boolean;
}

const summaryTemplates = [
	{
		value: "default",
		label: "Pontos Principais & Ações (Padrão)",
	},
	{
		value: "executive",
		label: "Resumo Executivo",
	},
	{
		value: "detailed",
		label: "Análise Detalhada",
	},
	{
		value: "topics",
		label: "Tópicos e Subtópicos",
	},
	{
		value: "actionItems",
		label: "Apenas Ações",
	},
];

export function SummaryPanel({
	summary,
	onGenerate,
	isGenerating,
}: SummaryPanelProps) {
	const [selectedTemplate, setSelectedTemplate] = useState("default");
	const [additionalInstructions, setAdditionalInstructions] = useState("");
	const [showInstructions, setShowInstructions] = useState(false);

	const handleGenerate = () => {
		onGenerate(selectedTemplate, additionalInstructions || undefined);
	};

	const handleCopyMarkdown = () => {
		if (summary) {
			navigator.clipboard.writeText(summary);
			// TODO: Adicionar toast de feedback
		}
	};

	const handleDownloadPDF = () => {
		// TODO: Implementar download de PDF
		console.log("Download PDF");
	};

	return (
		<div className="flex flex-col h-full bg-white dark:bg-stone-900">
			{/* Header */}
			<div className="p-6 border-b border-stone-200 dark:border-stone-800">
				<div className="flex items-center gap-2 mb-4">
					<Sparkles className="w-5 h-5 text-teal-600" />
					<h2 className="text-lg font-semibold text-stone-900 dark:text-white">
						Resumo Inteligente
					</h2>
				</div>

				{/* Template de resumo */}
				<div className="space-y-4">
					<div>
						<label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">
							Template de Resumo
						</label>
						<Select
							value={selectedTemplate}
							onValueChange={setSelectedTemplate}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{summaryTemplates.map((template) => (
									<SelectItem key={template.value} value={template.value}>
										{template.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Instruções adicionais (colapsável) */}
					<div>
						<button
							onClick={() => setShowInstructions(!showInstructions)}
							className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
							type="button"
						>
							<span className="uppercase font-semibold text-xs text-teal-600 dark:text-teal-400">
								Opcional
							</span>
							<ChevronDown
								className={`w-4 h-4 transition-transform ${
									showInstructions ? "rotate-180" : ""
								}`}
							/>
							Instruções Adicionais
						</button>

						{showInstructions && (
							<Textarea
								placeholder="Ex: Foque nos pontos sobre design visual..."
								value={additionalInstructions}
								onChange={(e) => setAdditionalInstructions(e.target.value)}
								rows={3}
								className="mt-2"
							/>
						)}
					</div>

					{/* Botão gerar */}
					<Button
						onClick={handleGenerate}
						disabled={isGenerating}
						className="w-full bg-teal-600 hover:bg-teal-700"
					>
						{isGenerating ? (
							<>
								<Sparkles className="w-4 h-4 mr-2 animate-spin" />
								Gerando resumo...
							</>
						) : (
							<>
								<Sparkles className="w-4 h-4 mr-2" />
								Gerar resumo
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Resumo gerado */}
			<div className="flex-1 overflow-y-auto p-6">
				{summary ? (
					<div className="space-y-4">
						{/* Data de geração */}
						<p className="text-xs text-stone-500 dark:text-stone-400 italic">
							Gerado em{" "}
							{new Date().toLocaleDateString("pt-BR", {
								day: "2-digit",
								month: "long",
								year: "numeric",
							})}
						</p>

						{/* Conteúdo do resumo (markdown) */}
						<div className="prose dark:prose-invert prose-sm max-w-none">
							<div
								className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap"
								dangerouslySetInnerHTML={{ __html: summary }}
							/>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full text-center text-stone-500 dark:text-stone-400">
						<Sparkles className="w-12 h-12 mb-4 opacity-50" />
						<p className="text-sm font-medium mb-2">
							Nenhum resumo gerado ainda
						</p>
						<p className="text-xs max-w-sm">
							Selecione um template e clique em "Gerar resumo" para criar um
							resumo inteligente da transcrição
						</p>
					</div>
				)}
			</div>

			{/* Footer com ações */}
			{summary && (
				<div className="p-4 border-t border-stone-200 dark:border-stone-800 flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleCopyMarkdown}
						className="flex-1"
					>
						<Copy className="w-4 h-4 mr-2" />
						Copiar Markdown
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleDownloadPDF}
						className="flex-1"
					>
						<Download className="w-4 h-4 mr-2" />
						Download PDF
					</Button>
				</div>
			)}
		</div>
	);
}

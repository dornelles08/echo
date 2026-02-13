import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function Hero() {
	return (
		<section className="pt-32 pb-16 px-4 bg-stone-100 dark:bg-stone-900">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-8">
					<h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight">
						Transforme áudio e vídeo em{" "}
						<span className="text-teal-700 dark:text-teal-500 italic">
							texto inteligente
						</span>{" "}
						em minutos.
					</h1>

					<p className="text-lg text-stone-600 dark:text-stone-400 max-w-3xl mx-auto mb-10">
						Transcreva reuniões, aulas e podcasts. Gere resumos automáticos,
						organize insights e exporte em PDF com a precisão da inteligência
						artificial.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link to="/sign-in">
							<Button
								size="lg"
								className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-8 rounded-full group"
							>
								Começar agora
								<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
						<Button
							size="lg"
							variant="outline"
							className="border-stone-300 hover:bg-stone-200 dark:border-stone-700 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 px-8 rounded-full"
						>
							Ver demonstração
						</Button>
					</div>
				</div>

				{/* Preview mockup */}
				<div className="mt-16 relative">
					<div className="bg-white dark:bg-stone-950 rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-stone-200 dark:border-stone-800">
						<div className="flex items-center gap-2 mb-6">
							<div className="w-3 h-3 rounded-full bg-red-400"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-400"></div>
							<div className="w-3 h-3 rounded-full bg-green-400"></div>
						</div>

						<div className="space-y-4">
							<div className="flex items-start gap-4">
								<div className="w-20 h-20 bg-stone-200 dark:bg-stone-800 rounded animate-pulse"></div>
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/4 animate-pulse"></div>
									<div className="h-4 bg-stone-300 dark:bg-stone-700 rounded w-full animate-pulse"></div>
								</div>
								<div className="w-24 h-8 bg-orange-200 dark:bg-orange-900 rounded animate-pulse"></div>
							</div>

							<div className="space-y-2 pt-4">
								<div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-full animate-pulse"></div>
								<div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-5/6 animate-pulse"></div>
								<div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-4/6 animate-pulse"></div>
							</div>

							<div className="grid grid-cols-2 gap-4 pt-4">
								<div className="h-24 bg-stone-100 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800 animate-pulse"></div>
								<div className="h-24 bg-orange-50 dark:bg-orange-950 rounded border border-orange-200 dark:border-orange-800 animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

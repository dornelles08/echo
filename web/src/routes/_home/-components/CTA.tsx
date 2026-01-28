import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function CTA() {
	return (
		<section className="py-20 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="bg-linear-to-br from-teal-700 to-teal-800 dark:from-teal-600 dark:to-teal-700 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
					{/* Decorative elements */}
					<div className="absolute top-0 left-0 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
					<div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-900/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

					<div className="relative z-10">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Pronto para economizar
							<br />
							horas da sua semana?
						</h2>

						{/* <p className="text-lg text-teal-50 max-w-2xl mx-auto mb-10">
							Junte-se a mais de 10.000 profissionais que já usam o Echo para
							otimizar seus fluxos de trabalho.
						</p> */}

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link to="/sign-in">
								<Button
									size="lg"
									className="bg-white hover:bg-stone-100 text-teal-800 px-8 rounded-full font-semibold"
								>
									Começar Grátis agora
								</Button>
							</Link>
							{/* <Button
								size="lg"
								variant="outline"
								className="border-white/30 hover:bg-white/10 text-white px-8 rounded-full"
							>
								Falar com vendas
							</Button> */}
						</div>

						<p className="text-sm text-teal-100 mt-8">
							Não precisa cartão de crédito • 14 minutos grátis no primeiro mês
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

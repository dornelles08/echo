import logo from "../../../assets/Echo Light 1650x650 - sem fundo.png";

export function Footer() {
	return (
		<footer className="bg-white dark:bg-black border-t border-stone-200 dark:border-stone-800 py-12 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="grid md:grid-cols-4 gap-8 mb-8">
					{/* Brand */}
					<div>
						<img src={logo} alt="Echo" className="h-16" />
						<p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
							A plataforma inteligente de transcrição que auxilia profissionais
							e equipes a transformar conversas em resultados.
						</p>
					</div>

					{/* Produto */}
					{/* <div>
						<h4 className="font-semibold text-stone-900 mb-4">Produto</h4>
						<ul className="space-y-3">
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Transcrição
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Resumos IA
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Integrações
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Segurança
								</a>
							</li>
						</ul>
					</div> */}

					{/* Empresa */}
					{/* <div>
						<h4 className="font-semibold text-stone-900 mb-4">Empresa</h4>
						<ul className="space-y-3">
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Sobre nós
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Preços
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
								>
									Contato
								</a>
							</li>
						</ul>
					</div> */}

					{/* Social */}
					{/* <div>
						<h4 className="font-semibold text-stone-900 mb-4">Social</h4>
						<div className="flex items-center gap-3">
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-stone-100 hover:bg-teal-100 flex items-center justify-center transition-colors group"
								aria-label="Facebook"
							>
								<Facebook className="w-5 h-5 text-stone-700 group-hover:text-teal-700" />
							</a>
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-stone-100 hover:bg-teal-100 flex items-center justify-center transition-colors group"
								aria-label="Twitter"
							>
								<Twitter className="w-5 h-5 text-stone-700 group-hover:text-teal-700" />
							</a>
						</div>
					</div> */}
				</div>

				<div className="border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-stone-600 dark:text-stone-400">
						© {new Date().getFullYear()} Echo. Todos os direitos reservados.
						Feito com carinho.
					</p>
					<div className="flex items-center gap-6">
						{/* <a
							href="#"
							className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
						>
							Política de Privacidade
						</a>
						<a
							href="#"
							className="text-sm text-stone-600 hover:text-teal-700 transition-colors"
						>
							Termos de Uso
						</a> */}
					</div>
				</div>
			</div>
		</footer>
	);
}

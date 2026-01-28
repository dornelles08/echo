import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import logo from "../../../assets/Echo Light 1650x650 - sem fundo.png";

export function Header() {
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<img src={logo} alt="Echo" className="h-16" />

					<nav className="hidden md:flex items-center gap-8">
						<a
							href="#funciona"
							className="text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
						>
							Como funciona
						</a>
						<a
							href="#recursos"
							className="text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
						>
							Recursos
						</a>
						<a
							href="#precos"
							className="text-sm text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
						>
							Preços
						</a>
					</nav>

					<div className="flex items-center gap-4">
						<button
							onClick={toggleTheme}
							className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors text-stone-700 dark:text-stone-300"
							aria-label={
								theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
							}
							type="button"
						>
							{theme === "light" ? (
								<Moon className="w-5 h-5" />
							) : (
								<Sun className="w-5 h-5" />
							)}
						</button>
						<Link to="/sign-in">
							<Button className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-6 rounded-full">
								Começar agora
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}

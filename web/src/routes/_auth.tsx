import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

import logo from "../assets/Echo Light 1650x650 - sem fundo.png";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex items-center justify-center p-4 relative">
			{/* Botão de tema no canto superior direito */}
			<button
				onClick={toggleTheme}
				className="absolute top-6 right-6 p-3 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-full shadow-sm border border-stone-200 dark:border-stone-800 transition-colors"
				aria-label={
					theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
				}
				type="button"
			>
				{theme === "light" ? (
					<Moon className="w-5 h-5 text-stone-700 dark:text-stone-300" />
				) : (
					<Sun className="w-5 h-5 text-stone-300" />
				)}
			</button>

			{/* Card centralizado */}
			<div className="w-full max-w-md">
				<div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-8 border border-stone-200 dark:border-stone-800">
					<img src={logo} alt="Echo Logo" />
					<Outlet />
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-xs text-stone-400 dark:text-stone-600 uppercase tracking-wide">
						ECHO AI SYSTEMS
					</p>
				</div>
			</div>
		</div>
	);
}

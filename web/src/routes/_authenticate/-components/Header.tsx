import { Moon, Plus, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-8 flex items-center justify-between">
			{/* Search */}
			<div className="flex-1 max-w-xl">
				{/* <div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
					<Input
						type="search"
						placeholder="Buscar mídias ou transcrições..."
						className="pl-10 bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-teal-500"
					/>
				</div> */}
			</div>

			{/* Actions */}
			<div className="flex items-center gap-3">
				<button
					onClick={toggleTheme}
					className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
					aria-label="Alternar tema"
					type="button"
				>
					{theme === "light" ? (
						<Moon className="w-5 h-5" />
					) : (
						<Sun className="w-5 h-5" />
					)}
				</button>

				{/* <button
					className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors relative"
					aria-label="Notificações"
					type="button"
				>
					<Bell className="w-5 h-5" />
					<span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full"></span>
				</button> */}

				<Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 text-white gap-2">
					<Plus className="w-4 h-4" />
					Nova mídia
				</Button>
			</div>
		</header>
	);
}

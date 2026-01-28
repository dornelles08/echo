import { Link, useLocation } from "@tanstack/react-router";
import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const menuItems = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		href: "/dashboard",
	},
	{
		label: "Arquivos",
		icon: FileText,
		href: "/dashboard/files",
	},
	{
		label: "Modelos de IA",
		icon: Sparkles,
		href: "/dashboard/models",
	},
	{
		label: "Projetos",
		icon: FolderOpen,
		href: "/dashboard/projects",
	},
];

export function Sidebar() {
	const location = useLocation();

	return (
		<aside className="w-60 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col">
			{/* Logo */}
			<div className="p-6 border-b border-stone-200 dark:border-stone-800">
				<Link to="/dashboard" className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center">
						<div className="w-2 h-2 bg-white rounded-full"></div>
					</div>
					<span className="text-xl font-semibold text-stone-900 dark:text-white">
						echo
					</span>
				</Link>
			</div>

			{/* Menu Items */}
			<nav className="flex-1 p-4">
				<ul className="space-y-1">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.href;

						return (
							<li key={item.href}>
								<Link
									to={item.href}
									className={cn(
										"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
										isActive
											? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white"
											: "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50",
									)}
								>
									<Icon className="w-5 h-5" />
									{item.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Bottom Section */}
			<div className="p-4 border-t border-stone-200 dark:border-stone-800">
				<Link
					to="/settings"
					className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
				>
					<Settings className="w-5 h-5" />
					Configurações
				</Link>

				{/* User Info */}
				<div className="mt-4 flex items-center gap-3 px-3 py-2">
					<div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
						JD
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-stone-900 dark:text-white truncate">
							João D.
						</p>
						<p className="text-xs text-stone-500 dark:text-stone-500 truncate">
							Plano Pro
						</p>
					</div>
				</div>
			</div>
		</aside>
	);
}

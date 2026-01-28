import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "./_authenticate/-components/Header";

export const Route = createFileRoute("/_authenticate")({
	component: AuthneticateLayout,
});

function AuthneticateLayout() {
	return (
		<div className="flex h-screen bg-stone-50 dark:bg-stone-950">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto p-8 bg-stone-50 dark:bg-stone-950">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

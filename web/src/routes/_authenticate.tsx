import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import { Header } from "./_authenticate/dashboard/-components/Header";

export const Route = createFileRoute("/_authenticate")({
	beforeLoad: async () => {
		const token = localStorage.getItem("auth_token");

		if (!token) {
			throw redirect({ to: "/sign-in" });
		}

		// Verifica se o token é válido fazendo uma requisição para um endpoint protegido
		try {
			await api.get("/me");
		} catch (error: any) {
			// Se o erro não for 401, remove o token e redireciona
			// Erros 401 são tratados automaticamente pelo interceptor da API
			// if (error.response?.status !== 401) {
			// 	localStorage.removeItem("auth_token");
			// 	throw redirect({ to: "/sign-in" });
			// }
			// Se for 401, o interceptor já tentará fazer o refresh
			// Se o refresh falhar, ele redirecionará para o login
		}
	},
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

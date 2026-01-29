import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "./_authenticate/dashboard/-components/Header";

export const Route = createFileRoute("/_authenticate")({
	beforeLoad: async () => {
		const token = localStorage.getItem("auth_token");

		if (!token) {
			throw redirect({ to: "/sign-in" });
		}

		// Verifica se o token é válido fazendo uma requisição para um endpoint protegido
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL || "http://localhost:3333"}/me`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.ok) {
				if (response.status === 401) {
					// Token inválido, remove e redireciona para login
					localStorage.removeItem("auth_token");
					throw redirect({ to: "/sign-in" });
				}
				// Outros erros, permite o acesso mas pode mostrar aviso
			}
		} catch (error) {
			// Erro de rede ou falha na verificação, remove o token e redireciona
			localStorage.removeItem("auth_token");
			throw redirect({ to: "/sign-in" });
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

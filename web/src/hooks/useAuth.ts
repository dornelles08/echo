import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

export interface AuthResponse {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export type Provider = "google" | "github" | "facebook";

// Hook de Login
export function useLogin() {
	return useMutation({
		mutationFn: async (data: LoginFormData): Promise<AuthResponse> => {
			const response = await api.post("/authenticate", data);
			return response.data;
		},
		onSuccess: (data) => {
			// Salva o token no localStorage
			console.log(data);
			
			localStorage.setItem("auth_token", data.token);

			// Salva os dados do usuário
			// localStorage.setItem("user", JSON.stringify(data.user));
		},
	});
}

// Hook de Cadastro
export function useRegister() {
	return useMutation({
		mutationFn: async (data: RegisterFormData): Promise<AuthResponse> => {
			const response = await api.post("/users", data);
			return response.data;
		},
		onSuccess: (data) => {
			// Salva o token no localStorage
			localStorage.setItem("auth_token", data.token);

			// Salva os dados do usuário
			localStorage.setItem("user", JSON.stringify(data.user));
		},
	});
}

// Hook para login com provedor social
export function useSocialLogin() {
	return useMutation({
		mutationFn: async (provider: Provider) => {
			const response = await api.get(`/auth/${provider}`);
			return response.data;
		},
		onSuccess: (data) => {
			// O backend deve redirecionar para a página de autorização do provedor
			// e, após a autenticação, redirecionar de volta para a aplicação
			// com o token na URL ou em um cookie.
			// O ideal é que o backend lide com o redirecionamento.
			if (data.redirectUrl) {
				window.location.href = data.redirectUrl;
			}
		},
	});
}

// Hook para Logout
export function useLogout() {
	return useMutation({
		mutationFn: async () => {
			// await api.post("/auth/logout");
		},
		onSuccess: () => {
			// Remove dados de autenticação
			localStorage.removeItem("auth_token");
			// localStorage.removeItem("user");
		},
	});
}

import axios from "axios";

// URL base da API - ajuste conforme necessário
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("auth_token");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Flag para controlar refresh de token
let isRefreshing = false;

// Rotas que não devem trigger redirect em 401 (são erros de credenciais, não token expirado)
const authRoutes = ["/authenticate"];

// Interceptor para tratamento de erros com refresh automático
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		console.log("API Error:", error.response?.status, error.response?.data);

		if (error.response?.status === 401) {
			const isAuthRoute = authRoutes.some((route) => error.config.url.includes(route));

			if (isAuthRoute) {
				return Promise.reject(error);
			}

			// Token inválido ou expirado
			console.log("401 Error - attempting token refresh");

			if (!isRefreshing) {
				isRefreshing = true;

				try {
					// Tenta fazer refresh do token
					const refreshResponse = await api.post("/refresh-token");
					const newToken = refreshResponse.data.token;

					// Atualiza o localStorage
					localStorage.setItem("auth_token", newToken);
				} catch (refreshError) {
					console.error("Failed to refresh token:", refreshError);

					// Se o refresh falhar, remove o token e redireciona
					localStorage.removeItem("auth_token");
					window.location.href = "/sign-in";
				} finally {
					isRefreshing = false;
				}
			} else {
				// Se já está fazendo refresh, remove o token e redireciona
				localStorage.removeItem("auth_token");
				window.location.href = "/sign-in";
			}
		}

		return Promise.reject(error);
	},
);

// Interceptor para adicionar o token atualizado em requisições repetidas
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("auth_token");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

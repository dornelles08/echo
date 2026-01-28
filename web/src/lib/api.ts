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

// Interceptor para tratamento de erros
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.log("API Error:", error.response?.status, error.response?.data);
		if (error.response?.status === 401) {
			console.log("401 Error - removing token");
			localStorage.removeItem("auth_token");
			window.location.href = "/sign-in";
		}

		return Promise.reject(error);
	},
);

import { z } from "zod";

// Schema de Login
export const loginSchema = z.object({
	email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
	password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema de Cadastro
export const registerSchema = z.object({
	name: z
		.string()
		.min(3, "Nome deve ter no mínimo 3 caracteres")
		.max(100, "Nome muito longo"),
	email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
	password: z
		.string()
		.min(8, "A senha deve ter no mínimo 8 caracteres")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"A senha deve conter letras maiúsculas, minúsculas e números",
		),
	userPrompt: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

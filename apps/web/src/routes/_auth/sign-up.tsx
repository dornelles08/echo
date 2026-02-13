import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister, useSocialLogin, type Provider } from "@/hooks/useAuth";
import { type RegisterFormData, registerSchema } from "@/schemas/auth.schema";

import { Divider } from "./-components/divider";
import { SocialSignInButtons } from "./-components/social-buttons";

export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
});

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const registerMutation = useRegister();
	const socialLoginMutation = useSocialLogin();

	const passwordFieldsId = useId();
	const emailFieldsId = useId();
	const nameFieldsId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await registerMutation.mutateAsync(data);
			// Redireciona para o dashboard após cadastro bem-sucedido
			navigate({ to: "/dashboard" });
		} catch (error) {
			console.error("Erro ao criar conta:", error);
		}
	};

	const handleSocialSignIn = (provider: Provider) => {
		socialLoginMutation.mutate(provider);
	};

	return (
		<>
			<p className="text-center text-stone-600 dark:text-stone-400 mb-6">
				Crie sua conta para transcrições inteligentes
			</p>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Nome completo */}
				<div>
					<Label
						htmlFor={nameFieldsId}
						className="text-stone-900 dark:text-stone-100 mb-2 block"
					>
						Nome completo
					</Label>
					<Input
						id={nameFieldsId}
						type="text"
						placeholder="Como devemos chamar você?"
						{...register("name")}
						className={errors.name ? "border-red-500" : ""}
					/>
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
					)}
				</div>

				{/* E-mail */}
				<div>
					<Label
						htmlFor={emailFieldsId}
						className="text-stone-900 dark:text-stone-100 mb-2 block"
					>
						E-mail
					</Label>
					<Input
						id={emailFieldsId}
						type="email"
						placeholder="exemplo@email.com"
						{...register("email")}
						className={errors.email ? "border-red-500" : ""}
					/>
					{errors.email && (
						<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
					)}
				</div>

				{/* Senha */}
				<div>
					<Label
						htmlFor={passwordFieldsId}
						className="text-stone-900 dark:text-stone-100 mb-2 block"
					>
						Senha
					</Label>
					<div className="relative">
						<Input
							id={passwordFieldsId}
							type={showPassword ? "text" : "password"}
							placeholder="Mínimo 8 caracteres"
							{...register("password")}
							className={errors.password ? "border-red-500 pr-10" : "pr-10"}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
						>
							{showPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1">
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Mensagem de erro da API */}
				{(registerMutation.isError || socialLoginMutation.isError) && (
					<div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
						{registerMutation.error instanceof Error
							? registerMutation.error.message
							: socialLoginMutation.error instanceof Error
								? socialLoginMutation.error.message
								: "Erro ao criar conta. Tente novamente."}
					</div>
				)}

				{/* Botão de submit */}
				<Button
					type="submit"
					className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white h-12 text-base font-medium"
					disabled={isSubmitting || registerMutation.isPending}
				>
					{isSubmitting || registerMutation.isPending
						? "Criando conta..."
						: "Criar conta"}
				</Button>
			</form>

			<Divider />

			<SocialSignInButtons
				onSignIn={handleSocialSignIn}
				isSubmitting={isSubmitting || registerMutation.isPending}
			/>

			{/* Link para login */}
			<div className="mt-6 text-center">
				<p className="text-sm text-stone-600 dark:text-stone-400">
					Já possui uma conta?{" "}
					<Link
						to="/sign-in"
						className="text-teal-700 dark:text-teal-400 hover:underline font-medium"
					>
						Fazer login
					</Link>
				</p>
			</div>
		</>
	);
}

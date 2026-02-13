import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

type Provider = "google" | "github" | "facebook";

interface SocialSignInButtonsProps {
	onSignIn: (provider: Provider) => void;
	isSubmitting?: boolean;
}

export function SocialSignInButtons({
	onSignIn,
	isSubmitting,
}: SocialSignInButtonsProps) {
	const socialProviders: {
		name: Provider;
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			name: "google",
			icon: <Icons.google className="w-5 h-5" />,
			label: "Continue with Google",
		},
	];

	return (
		<div className="space-y-3">
			{socialProviders.map((provider) => (
				<Button
					key={provider.name}
					variant="outline"
					className="w-full h-12 text-base"
					onClick={() => onSignIn(provider.name)}
					disabled={isSubmitting}
				>
					<span className="mr-2">{provider.icon}</span>
					{provider.label}
				</Button>
			))}
		</div>
	);
}

import { CTA } from "./-components/CTA";
import { Footer } from "./-components/Footer";
import { Header } from "./-components/Header";
import { Hero } from "./-components/Hero";
import { HowItWorks } from "./-components/HowItWorks";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-stone-100 dark:bg-stone-950">
			<Header />
			<main>
				<Hero />
				<HowItWorks />
				{/* <Features /> */}
				<CTA />
			</main>
			<Footer />
		</div>
	);
}

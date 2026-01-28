export function Divider() {
	return (
		<div className="relative my-6">
			<div className="absolute inset-0 flex items-center">
				<span className="w-full border-t" />
			</div>
			<div className="relative flex justify-center text-xs uppercase">
				<span className="bg-white px-2 text-stone-500 dark:bg-stone-950 dark:text-stone-400">
					Ou continue com
				</span>
			</div>
		</div>
	);
}

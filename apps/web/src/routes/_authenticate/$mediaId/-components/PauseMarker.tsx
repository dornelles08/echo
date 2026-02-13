interface PauseMarkerProps {
	duration?: string;
}

export function PauseMarker({ duration }: PauseMarkerProps) {
	return (
		<div className="flex items-center gap-3 py-2 px-4">
			<div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
			<span className="text-xs text-stone-400 dark:text-stone-600 font-medium">
				{duration ? `pausa (${duration})` : "pausa longa"}
			</span>
			<div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
		</div>
	);
}

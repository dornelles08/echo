import { X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TagInputProps {
	tags: string[];
	onChange: (tags: string[]) => void;
	error?: string;
	maxTags?: number;
}

export function TagInput({
	tags,
	onChange,
	error,
	maxTags = 10,
}: TagInputProps) {
	const [inputValue, setInputValue] = useState("");

	const addTag = (tag: string) => {
		const trimmedTag = tag.trim();

		if (!trimmedTag) return;

		// Adiciona # se não tiver
		const formattedTag = trimmedTag.startsWith("#")
			? trimmedTag
			: `#${trimmedTag}`;

		// Verifica se já existe
		if (tags.includes(formattedTag)) {
			setInputValue("");
			return;
		}

		// Verifica limite
		if (tags.length >= maxTags) {
			return;
		}

		onChange([...tags, formattedTag]);
		setInputValue("");
	};

	const removeTag = (tagToRemove: string) => {
		onChange(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag(inputValue);
		} else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
			// Remove última tag se backspace com input vazio
			removeTag(tags[tags.length - 1]);
		} else if (e.key === "," || e.key === " ") {
			e.preventDefault();
			addTag(inputValue);
		}
	};

	return (
		<div>
			<Label className="text-stone-900 dark:text-white mb-2 block">
				Tags
				{tags.length > 0 && (
					<span className="text-stone-500 dark:text-stone-400 text-sm font-normal ml-2">
						({tags.length}/{maxTags})
					</span>
				)}
			</Label>

			{/* Tags exibidas */}
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
					{tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-sm rounded-full"
						>
							{tag}
							<button
								type="button"
								onClick={() => removeTag(tag)}
								className="hover:bg-teal-700 rounded-full p-0.5 transition-colors"
							>
								<X className="w-3 h-3" />
							</button>
						</span>
					))}
				</div>
			)}

			{/* Input para adicionar novas tags */}
			<Input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Ex: #ux #entrevista #design"
				disabled={tags.length >= maxTags}
				className={error ? "border-red-500" : ""}
			/>

			<p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
				Digite e pressione Enter, espaço ou vírgula para adicionar. Backspace
				para remover.
			</p>

			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
}

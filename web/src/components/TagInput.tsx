import { X } from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTags } from "@/hooks/useMedia";

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
	const [showSuggestions, setShowSuggestions] = useState(false);
	const { data: availableTags = [] } = useTags();

	const addTag = (tag: string) => {
		const trimmedTag = tag.trim();

		if (!trimmedTag) return;

		// Remove # se tiver
		const formattedTag = trimmedTag.startsWith("#")
			? trimmedTag.slice(1)
			: trimmedTag;

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
		setShowSuggestions(false);
	};

	// Filtra sugestões baseadas no input
	const filteredSuggestions = useMemo(() => {
		if (!inputValue.trim()) return [];

		const searchTerm = inputValue.toLowerCase().replace("#", "");
		return availableTags
			.filter(
				(tag) => tag.toLowerCase().includes(searchTerm) && !tags.includes(tag),
			)
			.slice(0, 5); // Limita a 5 sugestões
	}, [availableTags, inputValue, tags]);

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
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			setShowSuggestions(true);
		} else if (e.key === "Escape") {
			e.preventDefault();
			setShowSuggestions(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		setShowSuggestions(value.trim().length > 0);
	};

	const selectSuggestion = (tag: string) => {
		addTag(tag);
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
							#{tag}
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
			<div className="relative">
				<Input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={() => setShowSuggestions(true)}
					onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
					placeholder="Ex: ux entrevista design"
					disabled={tags.length >= maxTags}
					className={error ? "border-red-500" : ""}
				/>

				{/* Sugestões de autocomplete */}
				{showSuggestions && filteredSuggestions.length > 0 && (
					<div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
						{filteredSuggestions.map((tag) => (
							<button
								key={tag}
								type="button"
								onClick={() => selectSuggestion(tag)}
								className="w-full px-3 py-2 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group"
							>
								<span className="text-stone-900 dark:text-white">{tag}</span>
								<span className="text-xs text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
									Pressione Enter
								</span>
							</button>
						))}
					</div>
				)}
			</div>

			<p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
				Digite e pressione Enter, espaço ou vírgula para adicionar. Use as setas
				para navegar nas sugestões. Backspace para remover.
			</p>

			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
}

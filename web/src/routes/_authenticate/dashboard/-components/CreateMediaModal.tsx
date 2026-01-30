import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, FileAudio, FileVideo, Loader2 } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { LanguageSelect } from "@/components/LanguageSelect";
import { TagInput } from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	formatFileSize,
	getAcceptedExtensions,
	UPLOAD_CONFIG,
	validateFileType,
} from "@/config/upload";
import { useUploadAndCreateMedia } from "@/hooks/useUploadMedia";
import { formatDuration } from "@/lib/duration";
import {
	type CreateMediaFormData,
	createMediaSchema,
} from "@/schemas/media.schema";

interface UploadMediaModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateMediaModal({
	open,
	onOpenChange,
}: UploadMediaModalProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);

	const uploadMutation = useUploadAndCreateMedia();
	const filenameId = useId();
	const promptId = useId();
	const durationId = useId();

	const {
		register,
		control,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors },
	} = useForm<CreateMediaFormData>({
		resolver: zodResolver(createMediaSchema),
		defaultValues: {
			language: "pt-BR",
			duration: undefined,
			tags: [],
			prompt: "",
		},
	});

	const durationWatch = watch("duration");

	const handleFileSelect = useCallback(
		(file: File) => {
			// Valida tamanho
			if (file.size > UPLOAD_CONFIG.maxFileSize) {
				alert(
					`Arquivo muito grande! Máximo: ${formatFileSize(UPLOAD_CONFIG.maxFileSize)}`,
				);
				return;
			}

			// Valida tipo
			const fileType = validateFileType(file);
			if (!fileType) {
				alert("Tipo de arquivo não suportado!");
				return;
			}

			const audio = new Audio();
			audio.onloadedmetadata = () => {
				const duration = audio.duration;
				setValue("duration", duration);
			};
			audio.src = URL.createObjectURL(file);

			setSelectedFile(file);
			setValue("file", file);
		},
		[setValue],
	);

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);

			if (e.dataTransfer.files?.[0]) {
				handleFileSelect(e.dataTransfer.files[0]);
			}
		},
		[handleFileSelect],
	);

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			handleFileSelect(e.target.files[0]);
		}
	};

	async function handleCreateMedia(data: CreateMediaFormData) {
		if (!selectedFile) return;

		const fileType = validateFileType(selectedFile);
		if (!fileType) return;

		try {
			await uploadMutation.mutateAsync({
				file: data.file,
				type: fileType,
				language: data.language,
				tags: data.tags,
				prompt: data.prompt,
			});

			// Reset e fecha modal
			reset();
			setSelectedFile(null);
			onOpenChange(false);
		} catch (error) {
			console.error("Erro ao fazer upload:", error);
		}
	}

	const handleClose = () => {
		reset();
		setSelectedFile(null);
		onOpenChange(false);
	};

	const getFileIcon = () => {
		if (!selectedFile)
			return <CloudUpload className="w-12 h-12 text-teal-600" />;

		const fileType = validateFileType(selectedFile);
		if (fileType === "video") {
			return <FileVideo className="w-12 h-12 text-teal-600" />;
		}
		return <FileAudio className="w-12 h-12 text-teal-600" />;
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Adicionar nova mídia</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(handleCreateMedia)} className="space-y-6">
					{/* Área de Upload */}
					<div
						aria-hidden="true"
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
						className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
							dragActive
								? "border-teal-600 bg-teal-50 dark:bg-teal-950"
								: "border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
						}`}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept={getAcceptedExtensions()}
							onChange={handleFileInputChange}
							className="hidden"
						/>

						<div className="flex flex-col items-center justify-center text-center cursor-pointer">
							{getFileIcon()}

							{selectedFile ? (
								<>
									<p className="mt-4 text-sm font-medium text-stone-900 dark:text-white">
										{selectedFile.name}
									</p>
									<p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
										{formatFileSize(selectedFile.size)}
									</p>
								</>
							) : (
								<>
									<p className="mt-4 text-base font-medium text-stone-900 dark:text-white">
										Arraste seu arquivo aqui
									</p>
									<p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
										Suporta MP4, MP3, WAV, M4A (máx.{" "}
										{formatFileSize(UPLOAD_CONFIG.maxFileSize)})
									</p>
								</>
							)}

							<Button
								type="button"
								variant="outline"
								className="mt-4 cursor-pointer"
							>
								Ou escolha do computador
							</Button>
						</div>

						{errors.file && (
							<p className="text-red-500 text-xs mt-2 text-center">
								{errors.file.message}
							</p>
						)}
					</div>

					{/* Nome do arquivo (auto-preenchido) */}
					<div>
						<Label
							htmlFor={filenameId}
							className="text-stone-900 dark:text-white mb-2 block"
						>
							Nome do arquivo
						</Label>
						<Input
							id={filenameId}
							value={selectedFile?.name || ""}
							disabled
							className="bg-stone-100 dark:bg-stone-800"
						/>
					</div>

					{/* Duração do arquivo (auto-preenchido) */}
					<div>
						<Label
							htmlFor={durationId}
							className="text-stone-900 dark:text-white mb-2 block"
						>
							Duração do arquivo
						</Label>
						<Input
							id={durationId}
							{...register("duration")}
							value={formatDuration(durationWatch)}
							disabled
							className="bg-stone-100 dark:bg-stone-800"
						/>
					</div>

					{/* Idioma */}
					<Controller
						name="language"
						control={control}
						render={({ field }) => (
							<LanguageSelect
								value={field.value || "pt-BR"}
								onChange={field.onChange}
								error={errors.language?.message}
							/>
						)}
					/>

					{/* Tags */}
					<Controller
						name="tags"
						control={control}
						render={({ field }) => (
							<TagInput
								tags={field.value}
								onChange={field.onChange}
								error={errors.tags?.message}
							/>
						)}
					/>

					{/* Prompt Contextual */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<Label
								htmlFor={promptId}
								className="text-stone-900 dark:text-white"
							>
								Prompt Contextual
							</Label>
							<span className="text-xs text-teal-600 dark:text-teal-400 uppercase font-semibold">
								Opcional - Melhora a precisão
							</span>
						</div>
						<Textarea
							id={promptId}
							placeholder="Forneça contexto para a IA. Ex: 'Esta é uma entrevista técnica sobre Design Systems com foco em acessibilidade...'"
							{...register("prompt")}
							rows={4}
							className={errors.prompt ? "border-red-500" : ""}
						/>
						{errors.prompt && (
							<p className="text-red-500 text-xs mt-1">
								{errors.prompt.message}
							</p>
						)}
						<p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
							A IA usará este contexto para entender melhor termos técnicos,
							nomes próprios e o tom da conversa.
						</p>
					</div>

					{/* Mensagem de erro geral */}
					{uploadMutation.isError && (
						<div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
							{uploadMutation.error instanceof Error
								? uploadMutation.error.message
								: "Erro ao fazer upload. Tente novamente."}
						</div>
					)}

					{/* Footer */}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={uploadMutation.isPending}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={!selectedFile || uploadMutation.isPending}
							className="bg-teal-600 hover:bg-teal-700"
						>
							{uploadMutation.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Enviando...
								</>
							) : (
								"Enviar"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

import whisper

from . import config

_model = None


def get_model():
    """Carrega e retorna o modelo Whisper."""
    global _model
    if _model is None:
        print(f"Carregando modelo Whisper: {config.MODEL_NAME}...")
        _model = whisper.load_model(config.MODEL_NAME)
        print("Modelo Whisper Carregado.")
    return _model


def transcribe_audio(
    audio_input: str, prompt: str | None = None, language: str | None = None
) -> dict:
    """
    Transcreve um arquivo de áudio usando o modelo Whisper.
    Aceita tanto caminho de arquivo local quanto URL.

    Args:
        audio_input: Caminho do arquivo de áudio ou URL
        prompt: Prompt opcional para melhorar a transcrição
        language: Idioma opcional para forçar transcrição

    Returns:
        Dicionário com resultado da transcrição
    """
    model = get_model()
    # Usa prompt vazio se None for passado
    effective_prompt = prompt or ""
    result = model.transcribe(
        audio_input, initial_prompt=effective_prompt, language=language
    )
    return result

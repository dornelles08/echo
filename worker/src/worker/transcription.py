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


def transcribe_audio(file_path: str, prompt: str = "") -> dict:
    """
    Transcreve um arquivo de áudio usando o modelo Whisper.
    """
    model = get_model()
    result = model.transcribe(file_path, initial_prompt=prompt)
    return result

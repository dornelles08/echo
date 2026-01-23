import os

from . import config


class FileNotFoundError(Exception):
    pass


def find_audio_file(task_id: str) -> str:
    """
    Encontra o caminho do arquivo de áudio para uma determinada tarefa.
    Levanta FileNotFoundError se o arquivo não for encontrado.
    """
    try:
        file_path = [
            os.path.join(config.UPLOAD_DIR, f)
            for f in os.listdir(config.UPLOAD_DIR)
            if f.startswith(task_id)
        ][0]
        return file_path
    except (IndexError, FileNotFoundError) as exc:
        raise FileNotFoundError(
            f"Arquivo de áudio para a tarefa {task_id} não encontrado em {config.UPLOAD_DIR}"
        ) from exc

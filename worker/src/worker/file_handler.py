import os
import requests
import logging
from urllib.parse import urlparse

from src.worker import config

logger = logging.getLogger(__name__)


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


def download_audio_file(media_id: str, url: str) -> str:
    """
    Baixa um arquivo de áudio de uma URL e salva localmente.

    Args:
        media_id: ID único do arquivo (para nomear o arquivo local)
        url: URL do arquivo de áudio

    Returns:
        Caminho do arquivo salvo localmente

    Raises:
        FileNotFoundError: Se não conseguir baixar o arquivo
    """
    try:
        # Extrai extensão do arquivo da URL
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)

        if not filename:
            # Se não conseguir extrair nome da URL, usa padrão
            filename = f"{media_id}.m4a"

        # Garante que o nome comece com media_id para facilitar busca
        file_name = f"{media_id}_{filename}"
        file_path = os.path.join(config.UPLOAD_DIR, file_name)

        # Baixa o arquivo
        logger.info(f"Baixando arquivo de {url} para {file_path}")

        response = requests.get(url, timeout=30)
        response.raise_for_status()

        # Salva o arquivo
        os.makedirs(config.UPLOAD_DIR, exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(response.content)

        logger.info(f"Arquivo baixado com sucesso: {file_path}")
        return file_path

    except Exception as e:
        logger.error(f"Erro ao baixar arquivo de {url}: {e}")
        raise FileNotFoundError(f"Não foi possível baixar o arquivo de {url}: {e}")

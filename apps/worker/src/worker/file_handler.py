import logging

from src.worker import database

logger = logging.getLogger(__name__)


class FileNotFoundError(Exception):
    pass


def get_audio_url(media_id: str) -> str:
    """
    Busca a URL do arquivo de áudio no MongoDB para uma determinada media.

    Args:
        media_id: ID único da mídia

    Returns:
        URL do arquivo de áudio

    Raises:
        FileNotFoundError: Se a mídia não for encontrada ou não tiver URL
    """
    try:
        doc = database.get_task(media_id)
        if not doc:
            raise FileNotFoundError(f"Mídia {media_id} não encontrada no banco")

        audio_url = doc.get("url")
        if not audio_url:
            raise FileNotFoundError(f"Mídia {media_id} não possui URL de áudio")

        if not audio_url.startswith("http"):
            raise FileNotFoundError(f"URL inválida para mídia {media_id}: {audio_url}")

        logger.info(f"URL encontrada para mídia {media_id}: {audio_url}")
        return audio_url

    except Exception as e:
        logger.error(f"Erro ao buscar URL da mídia {media_id}: {e}")
        raise FileNotFoundError(f"Não foi possível obter URL da mídia {media_id}: {e}")

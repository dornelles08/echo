import logging
import os
from urllib.parse import urlparse

import requests
from botocore.exceptions import ClientError

from src.worker.s3_storage import get_s3_client

logger = logging.getLogger(__name__)


def get_media_url(media_id: str) -> str:
    """
    Busca a URL do arquivo de mídia no MongoDB.
    Pode ser vídeo ou áudio.

    Args:
        media_id: ID único da mídia

    Returns:
        URL do arquivo de mídia

    Raises:
        FileNotFoundError: Se a mídia não for encontrada ou não tiver URL
    """
    from src.worker import database

    try:
        doc = database.get_task(media_id)
        if not doc:
            raise FileNotFoundError(f"Mídia {media_id} não encontrada no banco")

        media_url = doc.get("url")
        if not media_url:
            raise FileNotFoundError(f"Mídia {media_id} não possui URL")

        if not media_url.startswith(("http://", "https://", "s3://")):
            raise FileNotFoundError(f"URL inválida para mídia {media_id}: {media_url}")

        logger.info(f"URL encontrada para mídia {media_id}: {media_url}")
        return media_url

    except Exception as e:
        logger.error(f"Erro ao buscar URL da mídia {media_id}: {e}")
        raise FileNotFoundError(f"Não foi possível obter URL da mídia {media_id}: {e}")


def download_media_from_url(url: str, local_path: str) -> None:
    """
    Baixa arquivo de mídia de uma URL (HTTP ou S3) para o caminho local.

    Args:
        url: URL do arquivo (HTTP/HTTPS ou S3)
        local_path: Caminho local onde salvar o arquivo

    Raises:
        FileNotFoundError: Se não conseguir baixar o arquivo
    """
    try:
        if url.startswith("s3://"):
            # Parse S3 URL e baixa usando boto3
            s3_parts = url.replace("s3://", "").split("/", 1)
            if len(s3_parts) < 2:
                raise ValueError(f"URL S3 inválida: {url}")

            bucket, key = s3_parts
            s3 = get_s3_client()

            logger.info(f"Baixando do S3: s3://{bucket}/{key} para {local_path}")
            s3.download_file(bucket, key, local_path)

        elif url.startswith(("http://", "https://")):
            # Baixa via HTTP
            logger.info(f"Baixando via HTTP: {url} para {local_path}")

            response = requests.get(url, timeout=30, stream=True)
            response.raise_for_status()

            with open(local_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
        else:
            raise ValueError(f"Protocolo de URL não suportado: {url}")

        logger.info(f"Arquivo baixado com sucesso: {local_path}")

    except Exception as e:
        logger.error(f"Erro ao baixar arquivo de {url}: {e}")
        raise FileNotFoundError(f"Não foi possível baixar o arquivo de {url}: {e}")


def delete_media_from_url(url: str) -> bool:
    """
    Remove arquivo de mídia de uma URL S3.

    Args:
        url: URL do arquivo S3

    Returns:
        True se deletado com sucesso, False caso contrário
    """
    try:
        if not url.startswith("s3://"):
            logger.warning(f"Apenas URLs S3 são suportadas para deleção: {url}")
            return False

        # Parse S3 URL
        s3_parts = url.replace("s3://", "").split("/", 1)
        if len(s3_parts) < 2:
            raise ValueError(f"URL S3 inválida: {url}")

        bucket, key = s3_parts
        s3 = get_s3_client()

        logger.info(f"Deletando arquivo do S3: s3://{bucket}/{key}")
        s3.delete_object(Bucket=bucket, Key=key)

        logger.info(f"Arquivo deletado com sucesso: {url}")
        return True

    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            logger.warning(f"Arquivo não encontrado no S3 para deleção: {url}")
            return True  # Considera sucesso se arquivo não existe
        else:
            logger.error(f"Erro ao deletar arquivo do S3 {url}: {e}")
            return False
    except Exception as e:
        logger.error(f"Erro ao deletar arquivo {url}: {e}")
        return False


def get_file_extension(url: str) -> str:
    """
    Extrai extensão do arquivo da URL.

    Args:
        url: URL do arquivo

    Returns:
        Extensão do arquivo (com ponto)
    """
    parsed = urlparse(url)
    path = parsed.path
    return os.path.splitext(path)[1].lower()


def is_video_file(url: str) -> bool:
    """
    Verifica se a URL aponta para um arquivo de vídeo baseado na extensão.

    Args:
        url: URL do arquivo

    Returns:
        True se for vídeo, False caso contrário
    """
    video_extensions = {
        ".mp4",
        ".avi",
        ".mov",
        ".mkv",
        ".wmv",
        ".flv",
        ".webm",
        ".mpeg",
        ".mpg",
        ".3gp",
        ".ogv",
    }

    extension = get_file_extension(url)
    return extension in video_extensions

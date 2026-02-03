#!/usr/bin/env python3
import logging
import os
import sys
import time

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.worker import config, conversion, database, media_handler, task_queue

# Configura logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def process_conversion_task(job_id: str):
    """Processa uma única tarefa de conversão de vídeo para áudio."""
    logger.info("Processando job de conversão: %s", job_id)

    # Obtém dados completos do job
    job_data = task_queue.get_job_data(job_id)
    if not job_data:
        logger.error("Job %s não encontrado", job_id)
        return

    # Extrai payload do job
    job_payload = job_data.get("data", {})
    logger.info("Payload do job: %s", job_payload)

    # Valida dados do payload
    media_id = job_payload.get("mediaId")

    if not media_id:
        error_msg = "Job sem 'mediaId' no payload"
        logger.error(error_msg)
        task_queue.fail_task(job_id, ValueError(error_msg))
        return

    logger.info("Media ID: %s", media_id)

    # Busca documento no banco de dados usando media_id
    try:
        doc = database.get_task(media_id)
        if not doc:
            logger.warning("Media %s não encontrada no banco", media_id)
            task_queue.fail_task(
                job_id, ValueError("Media %s não encontrada no banco" % media_id)
            )
            return
    except Exception as e:
        task_queue.fail_task(job_id, ValueError("Erro ao buscar media no banco: %s", e))
        return

    # Marca início do processamento no banco (se existir)
    start_time = None

    try:
        start_time = database.mark_as_converting(media_id)
    except Exception as e:
        logger.warning("Erro ao marcar conversão no banco: %s", e)
        task_queue.fail_task(
            job_id, ValueError("Erro ao marcar conversão no banco: %s", e)
        )
        return

    try:
        # Obtém URL do arquivo de vídeo do MongoDB
        video_url = media_handler.get_media_url(media_id)

        # Verifica se é um arquivo de vídeo suportado
        if not media_handler.is_video_file(video_url):
            error_msg = f"Arquivo não é um vídeo suportado: {video_url}"
            logger.error(error_msg)
            raise ValueError(error_msg)

        logger.info("URL do vídeo: %s", video_url)

        # Extrai áudio do vídeo
        logger.info("Iniciando conversão de vídeo para áudio: %s", video_url)
        audio_url, video_metadata = conversion.extract_audio_from_video(
            video_url, media_id
        )

        # Atualiza o banco de dados com a URL do áudio
        duration = None
        if doc and start_time:
            try:
                duration = database.mark_as_converted(
                    media_id, start_time, audio_url, video_metadata
                )
                logger.info("Job %s convertido em %.2f segundos.", job_id, duration)
            except Exception as e:
                logger.error("Erro ao marcar conversão no banco: %s", e)
                task_queue.fail_task(job_id, e, should_retry=False)
                return
        else:
            # Se não existe no banco, apenas loga
            logger.warning(
                "Media %s não encontrada no banco, conversão não salva", media_id
            )

        # Remove o arquivo de vídeo original do MinIO
        logger.info("Removendo vídeo original do MinIO: %s", video_url)
        delete_success = media_handler.delete_media_from_url(video_url)
        if delete_success:
            logger.info("Vídeo original removido com sucesso")
        else:
            logger.warning("Falha ao remover vídeo original")

        # Completa job no BullMQ com status simples (os dados já estão no MongoDB)
        simple_result = {
            "mediaId": media_id,
            "status": "converted",
            "audioUrl": audio_url,
            "metadata": video_metadata,
            "timestamp": int(time.time()),
        }
        if duration:
            simple_result["duration"] = duration

        success = task_queue.complete_task(job_id, simple_result)
        if success:
            logger.info(
                "Job %s marcado como convertido no BullMQ (dados salvos no MongoDB)",
                job_id,
            )
        else:
            logger.error("Falha ao marcar job %s como convertido no BullMQ", job_id)

        logger.info("Conversão finalizada para media_id %s", media_id)

    except Exception as e:
        logger.error("Erro ao processar job de conversão %s: %s", job_id, e)

        # Marca como falha no banco (se existir)
        if doc and start_time:
            try:
                database.mark_as_conversion_failed(media_id, start_time, e)
            except Exception as db_error:
                logger.warning(
                    "Erro ao marcar falha de conversão no banco: %s", db_error
                )

        # Marca job como falha no BullMQ (irá tentar retry se configurado)
        task_queue.fail_task(job_id, e, should_retry=True)

        logger.error("Job de conversão %s falhou e foi marcado para retry", job_id)


def start():
    """Inicia o loop principal do worker BullMQ para conversão."""
    logger.info("Worker de conversão BullMQ iniciado. Aguardando tarefas...")

    # Cria worker específico para fila de conversão
    conversion_worker = task_queue.BullMQWorker(config.REDIS_CONVERSION_QUEUE)

    while True:
        try:
            job = conversion_worker.get_next_job(timeout=30)
            if job:
                logger.info("Job de conversão encontrado: %s", job["id"])
                process_conversion_task(job["id"])
            else:
                # Sem jobs, aguarda
                time.sleep(config.SLEEP_TIME)

        except KeyboardInterrupt:
            logger.info("Worker de conversão interrompido pelo usuário")
            break
        except Exception as e:
            logger.error("Erro inesperado no worker de conversão: %s", e)
            time.sleep(config.SLEEP_TIME)


if __name__ == "__main__":
    start()

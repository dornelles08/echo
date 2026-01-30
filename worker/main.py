#!/usr/bin/env python3
import logging
import os
import sys
import time

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.worker import config, database, file_handler, task_queue, transcription

# Configura logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def process_task(job_id: str):
    """Processa uma única tarefa de transcrição BullMQ."""
    logger.info("Processando job: %s", job_id)

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
    audio_url = job_payload.get("url")

    if not media_id:
        error_msg = "Job sem 'mediaId' no payload"
        logger.error(error_msg)
        task_queue.fail_task(job_id, ValueError(error_msg))
        return

    if not audio_url:
        error_msg = "Job sem 'url' no payload"
        logger.error(error_msg)
        task_queue.fail_task(job_id, ValueError(error_msg))
        return

    logger.info("Media ID: %s, URL: %s", media_id, audio_url)

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
        start_time = database.mark_as_processing(media_id)
    except Exception as e:
        logger.warning("Erro ao marcar processamento no banco: %s", e)
        task_queue.fail_task(
            job_id, ValueError("Erro ao marcar processamento no banco: %s", e)
        )
        return

    try:
        # Encontra o arquivo de áudio a partir da URL
        # A URL pode ser relativa ou absoluta
        if audio_url.startswith("http"):
            # URL HTTP - baixa arquivo
            audio_file_path = file_handler.download_audio_file(media_id, audio_url)
        elif audio_url.startswith("../"):
            # Path relativo - resolve para path absoluto
            audio_file_path = os.path.normpath(
                os.path.join(os.path.dirname(__file__), audio_url)
            )
        else:
            # Path absoluto ou relativo ao upload dir
            if not os.path.isabs(audio_url):
                audio_file_path = os.path.join(
                    config.UPLOAD_DIR, os.path.basename(audio_url)
                )
            else:
                audio_file_path = audio_url

        logger.info("Arquivo de áudio: %s", audio_file_path)

        # Verifica se arquivo existe
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(
                f"Arquivo de áudio não encontrado: {audio_file_path}"
            )

        # Transcreve o áudio
        logger.info("Iniciando transcrição do arquivo: %s", audio_file_path)
        prompt = doc.get("prompt") if doc and doc.get("prompt") else ""
        result = transcription.transcribe_audio(audio_file_path, prompt=prompt)

        # Marca como concluído no banco de dados
        duration = None
        if doc and start_time:
            try:
                duration = database.mark_as_transcribed(media_id, start_time, result)
                logger.info("Job %s transcrito em %.2f segundos.", job_id, duration)
            except Exception as e:
                logger.error("Erro ao marcar conclusão no banco: %s", e)
                task_queue.fail_task(job_id, e, should_retry=False)
                return
        else:
            # Se não existe no banco, apenas loga
            logger.warning(
                "Media %s não encontrada no banco, transcrição não salva", media_id
            )

        # Completa job no BullMQ com status simples (os dados já estão no MongoDB)
        simple_result = {
            "mediaId": media_id,
            "status": "transcribed",
            "timestamp": int(time.time()),
        }
        if duration:
            simple_result["duration"] = duration

        success = task_queue.complete_task(job_id, simple_result)
        if success:
            logger.info(
                "Job %s marcado como transcrito no BullMQ (dados salvos no MongoDB)",
                job_id,
            )
        else:
            logger.error("Falha ao marcar job %s como transcrito no BullMQ", job_id)

        logger.info("Transcrição finalizada para media_id %s", media_id)

    except Exception as e:
        logger.error("Erro ao processar job %s: %s", job_id, e)

        # Marca como falha no banco (se existir)
        if doc and start_time:
            try:
                database.mark_as_failed(media_id, start_time, e)
            except Exception as db_error:
                logger.warning("Erro ao marcar falha no banco: %s", db_error)

        # Marca job como falha no BullMQ (irá tentar retry se configurado)
        task_queue.fail_task(job_id, e, should_retry=True)

        logger.error("Job %s falhou e foi marcado para retry", job_id)


def start():
    """Inicia o loop principal do worker BullMQ."""
    logger.info("Worker BullMQ iniciado. Aguardando tarefas...")

    while True:
        try:
            job_id = task_queue.get_task_from_queue()
            logger.info("Job recebido: %s", job_id)
            if job_id:
                logger.info("Job encontrado: %s", job_id)
                process_task(job_id)
            else:
                # Sem jobs, aguarda
                time.sleep(config.SLEEP_TIME)

        except KeyboardInterrupt:
            logger.info("Worker interrompido pelo usuário")
            break
        except Exception as e:
            logger.error("Erro inesperado no worker: %s", e)
            time.sleep(config.SLEEP_TIME)


if __name__ == "__main__":
    start()

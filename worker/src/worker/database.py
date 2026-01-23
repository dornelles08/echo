from datetime import datetime, timezone

from pymongo import MongoClient

from . import config

_client = None


def get_db():
    """Retorna a instância do banco de dados MongoDB."""
    global _client
    if _client is None:
        _client = MongoClient(config.MONGO_URI)
    return _client.whisper_db


def get_task(task_id: str):
    """Busca uma tarefa no banco de dados pelo seu ID."""
    db = get_db()
    return db.transcriptions.find_one({"_id": task_id})


def update_task_status(task_id: str, status: str, extra_fields: dict = {}):
    """Atualiza o status e outros campos de uma tarefa."""
    db = get_db()
    update_doc = {"$set": {"status": status}}
    if extra_fields:
        update_doc["$set"].update(extra_fields)
    db.transcriptions.update_one({"_id": task_id}, update_doc)


def mark_as_processing(task_id: str):
    """Marca uma tarefa como 'em processamento'."""
    start_time = datetime.now(timezone.utc)
    update_task_status(task_id, "processing", {"started_at": start_time})
    return start_time


def mark_as_completed(task_id: str, start_time: datetime, result: dict):
    """Marca uma tarefa como 'concluída'."""
    end_time = datetime.now(timezone.utc)
    duration = (end_time - start_time).total_seconds()
    update_task_status(
        task_id,
        "completed",
        {
            "transcription": result["text"],
            "language": result["language"],
            "finished_at": end_time,
            "duration_seconds": duration,
            "model": config.MODEL_NAME,
        },
    )
    return duration


def mark_as_failed(task_id: str, start_time: datetime, error: Exception):
    """Marca uma tarefa como 'falha'."""
    end_time = datetime.now(timezone.utc)
    duration = (end_time - start_time).total_seconds()
    update_task_status(
        task_id,
        "failed",
        {
            "error": str(error),
            "finished_at": end_time,
            "duration_seconds": duration,
        },
    )

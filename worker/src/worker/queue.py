import redis

from . import config

_redis_client = None


def get_redis_client():
    """Retorna a instância do cliente Redis."""
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(config.REDIS_URI)
    return _redis_client


def get_task_from_queue():
    """
    Busca uma nova tarefa da fila principal e a move para a fila de processamento.
    Retorna o ID da tarefa ou None se a fila estiver vazia.
    """
    r = get_redis_client()
    task_id = r.brpoplpush(config.REDIS_QUEUE, config.REDIS_PROCESSING_QUEUE, timeout=5)
    return task_id.decode("utf-8") if task_id else None


def remove_from_processing_queue(task_id: str):
    """Remove uma tarefa da fila de processamento."""
    r = get_redis_client()
    r.lrem(config.REDIS_PROCESSING_QUEUE, 1, task_id)


def requeue_task(task_id: str):
    """Coloca uma tarefa de volta na fila principal em caso de falha."""
    r = get_redis_client()
    pipe = r.pipeline()
    pipe.rpush(config.REDIS_QUEUE, task_id)
    pipe.lrem(config.REDIS_PROCESSING_QUEUE, 1, task_id)
    pipe.execute()

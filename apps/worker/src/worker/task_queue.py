import json
import logging
import time
import uuid
from typing import Any, Dict, Optional

import redis

from src.worker import config

logger = logging.getLogger(__name__)

_redis_client = None


def get_redis_client():
    """Retorna a instância do cliente Redis."""
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(config.REDIS_URI)
    return _redis_client


class BullMQWorker:
    """Worker compatível com BullMQ para consumir jobs do backend Node.js."""

    def __init__(self, queue_name: str):
        self.queue_name = f"bull:{queue_name}"
        self.redis = get_redis_client()
        self.worker_token = str(uuid.uuid4())

        logger.info(f"BullMQ worker iniciado para fila: {queue_name}")
        logger.info(f"Worker token: {self.worker_token}")

    def move_expired_delayed_jobs(self):
        """
        Move jobs da fila delayed para wait quando o delay expirar.
        Essencial para compatibilidade completa com BullMQ.
        """
        try:
            current_time = int(time.time() * 1000)  # milliseconds

            # Busca todos os jobs cujo delay já expirou
            expired_jobs = self.redis.zrangebyscore(
                f"{self.queue_name}:delayed", min=0, max=current_time, withscores=False
            )

            if not expired_jobs:
                return 0

            # Converte bytes para strings
            expired_job_ids = [
                job_id.decode("utf-8") if isinstance(job_id, bytes) else str(job_id)
                for job_id in expired_jobs
            ]

            # Move jobs do delayed para wait usando pipeline atômico
            pipe = self.redis.pipeline()
            pipe.zrem(f"{self.queue_name}:delayed", *expired_job_ids)
            for job_id in expired_job_ids:
                pipe.lpush(f"{self.queue_name}:wait", job_id)

            results = pipe.execute()

            moved_count = len(expired_job_ids)
            if moved_count > 0:
                logger.info(
                    f"Moved {moved_count} expired jobs from delayed to wait queue: {expired_job_ids}"
                )

            return moved_count

        except Exception as e:
            logger.error(f"Erro ao mover jobs expirados da fila delayed: {e}")
            return 0

    def get_next_job(self, timeout: int = 30) -> Optional[Dict[str, Any]]:
        """
        Busca o próximo job da fila de espera do BullMQ.

        Args:
            timeout: Tempo em segundos para esperar por um job

        Returns:
            Dicionário com dados do job ou None se não houver jobs
        """
        try:
            # 1. PRIMEIRO: Verifica jobs delayed que expiraram
            self.move_expired_delayed_jobs()

            # 2. DEPOIS: Tenta obter job da fila wait usando BRPOP (compatível com BullMQ)
            result = self.redis.brpop(f"{self.queue_name}:wait", timeout=timeout)

            if not result:
                return None

            # Extrai job_id do resultado do BRPOP
            job_id = result[1].decode("utf-8")

            # Move job para fila active
            self.redis.lpush(f"{self.queue_name}:active", job_id)

            # Adiciona lock token ao job
            self.redis.hset(
                f"{self.queue_name}:{job_id}", "lockToken", self.worker_token
            )
            self.redis.hset(
                f"{self.queue_name}:{job_id}",
                "processedOn",
                str(int(time.time() * 1000)),
            )

            # Obtém dados completos do job
            job_data = self.redis.hgetall(f"{self.queue_name}:{job_id}")

            if not job_data:
                logger.error(f"Job {job_id} não encontrado no Redis")
                return None

            # Parse dos dados do job
            parsed_job = self._parse_job(job_data, job_id)
            logger.info(
                f"Job obtido: {parsed_job['id']} - {parsed_job.get('name', 'unknown')}"
            )

            return parsed_job

        except Exception as e:
            logger.error(f"Erro ao obter próximo job: {e}")
            return None

    def _parse_job(self, job_data: Dict[bytes, bytes], job_id: str) -> Dict[str, Any]:
        """Converte os dados brutos do job do Redis para um dicionário Python."""

        def safe_decode(value: bytes) -> str:
            return value.decode("utf-8") if value else ""

        def safe_json_parse(value: bytes) -> Any:
            if not value:
                return {}
            try:
                return json.loads(safe_decode(value))
            except (json.JSONDecodeError, UnicodeDecodeError):
                return {}

        return {
            "id": job_id,
            "name": safe_decode(job_data.get(b"name", b"")),
            "data": safe_json_parse(job_data.get(b"data")),
            "opts": safe_json_parse(job_data.get(b"opts")),
            "priority": int(safe_decode(job_data.get(b"priority", b"0"))),
            "timestamp": int(safe_decode(job_data.get(b"timestamp", b"0"))),
            "delay": int(safe_decode(job_data.get(b"delay", b"0"))),
            "attemptsMade": int(safe_decode(job_data.get(b"attemptsMade", b"0"))),
            "lockToken": safe_decode(job_data.get(b"lockToken", b"")),
        }

    def complete_job(
        self, job_id: str, result: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Marca um job como completado com sucesso.

        Args:
            job_id: ID do job a ser completado
            result: Resultado do processamento (opcional)

        Returns:
            True se sucesso, False caso contrário
        """
        try:
            timestamp = int(time.time() * 1000)

            # Remove da fila active
            self.redis.lrem(f"{self.queue_name}:active", 1, job_id)

            # Adiciona ao sorted set completed com timestamp como score
            self.redis.zadd(f"{self.queue_name}:completed", {job_id: timestamp})

            # Atualiza dados do job
            updates = {
                "finishedOn": str(timestamp),
                "returnvalue": json.dumps(result) if result else "null",
            }
            self.redis.hset(f"{self.queue_name}:{job_id}", mapping=updates)

            # Remove lock token
            self.redis.hdel(f"{self.queue_name}:{job_id}", "lockToken")

            logger.info(f"Job {job_id} marcado como transcrito no BullMQ")
            return True

        except Exception as e:
            logger.error(f"Erro ao completar job {job_id}: {e}")
            return False

    def fail_job(
        self, job_id: str, error: Exception, should_retry: bool = True
    ) -> bool:
        """
        Marca um job como falho.

        Args:
            job_id: ID do job que falhou
            error: Exceção que causou a falha
            should_retry: Se o job deve ser retentado (baseado nas configurações do job)

        Returns:
            True se sucesso, False caso contrário
        """
        try:
            timestamp = int(time.time() * 1000)

            # Obtém dados do job para verificar configurações
            job_data = self.redis.hgetall(f"{self.queue_name}:{job_id}")
            if not job_data:
                logger.error(f"Job {job_id} não encontrado para marcar como falho")
                return False

            parsed_job = self._parse_job(job_data, job_id)
            attempts_made = parsed_job.get("attemptsMade", 0) + 1
            max_attempts = parsed_job.get("opts", {}).get("attempts", 5)

            # Remove da fila active
            self.redis.lrem(f"{self.queue_name}:active", 1, job_id)

            if should_retry and attempts_made < max_attempts:
                # Reenfileira para nova tentativa
                self.redis.lpush(f"{self.queue_name}:wait", job_id)
                self.redis.hset(
                    f"{self.queue_name}:{job_id}", "attemptsMade", str(attempts_made)
                )

                # Aplica backoff delay se configurado
                delay = self._calculate_delay(parsed_job.get("opts", {}), attempts_made)
                if delay > 0:
                    # Move para delayed queue com timestamp correto
                    delay_until = timestamp + delay
                    self.redis.zadd(f"{self.queue_name}:delayed", {job_id: delay_until})
                    self.redis.lrem(f"{self.queue_name}:wait", 1, job_id)

                logger.warning(
                    f"Job {job_id} falhou e será retentado (tentativa {attempts_made}/{max_attempts})"
                )
            else:
                # Move para failed permanentemente
                self.redis.zadd(f"{self.queue_name}:failed", {job_id: timestamp})
                self.redis.hset(
                    f"{self.queue_name}:{job_id}", "attemptsMade", str(attempts_made)
                )
                self.redis.hset(
                    f"{self.queue_name}:{job_id}", "failedReason", str(error)
                )

                logger.error(
                    f"Job {job_id} falhou permanentemente após {attempts_made} tentativas"
                )

            # Remove lock token
            self.redis.hdel(f"{self.queue_name}:{job_id}", "lockToken")

            return True

        except Exception as e:
            logger.error(f"Erro ao falhar job {job_id}: {e}")
            return False

    def _calculate_delay(self, opts: Dict[str, Any], attempt: int) -> int:
        """Calcula o delay de retry baseado nas configurações do job."""
        backoff_config = opts.get("backoff", {})

        if not backoff_config:
            return 0

        backoff_type = backoff_config.get("type", "fixed")
        base_delay = backoff_config.get("delay", 1000)

        if backoff_type == "fixed":
            return base_delay
        elif backoff_type == "exponential":
            return base_delay * (2 ** (attempt - 1))
        elif backoff_type == "linear":
            return base_delay * attempt
        else:
            return base_delay


# Instância global do worker
_worker = None


def get_bullmq_worker() -> BullMQWorker:
    """Retorna instância do BullMQ worker."""
    global _worker
    if _worker is None:
        # Extrai nome da fila do config (remove prefixos se houver)
        queue_name = config.REDIS_TRANSCRIPTION_QUEUE.replace("bull:", "").replace(
            ":", "-"
        )
        _worker = BullMQWorker(queue_name)
    return _worker


def get_task_from_queue() -> Optional[str]:
    """
    Busca uma nova tarefa da fila BullMQ.
    Retorna o ID da tarefa ou None se a fila estiver vazia.
    """
    worker = get_bullmq_worker()
    job = worker.get_next_job(timeout=5)

    if job:
        # Para manter compatibilidade com o código existente, retorna o job_id
        return job["id"]

    return None


def get_job_data(job_id: str) -> Optional[Dict[str, Any]]:
    """
    Obtém dados completos de um job pelo ID.
    """
    worker = get_bullmq_worker()

    try:
        job_data = worker.redis.hgetall(f"{worker.queue_name}:{job_id}")
        if job_data:
            return worker._parse_job(job_data, job_id)
    except Exception as e:
        logger.error(f"Erro ao obter dados do job {job_id}: {e}")

    return None


def complete_task(job_id: str, result: Optional[Dict[str, Any]] = None) -> bool:
    """
    Marca uma tarefa como completada com sucesso.
    """
    worker = get_bullmq_worker()
    return worker.complete_job(job_id, result)


def fail_task(job_id: str, error: Exception, should_retry: bool = True) -> bool:
    """
    Marca uma tarefa como falha.
    """
    worker = get_bullmq_worker()
    return worker.fail_job(job_id, error, should_retry)

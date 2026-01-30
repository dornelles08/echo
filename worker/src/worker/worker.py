import time

import sys
import os

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from worker import config, database, file_handler, transcription, task_queue as queue


def process_task(task_id: str):
    """Processa uma única tarefa de transcrição."""
    print(f"Processando tarefa: {task_id}")

    doc = database.get_task(task_id)
    if not doc:
        print(f"Tarefa {task_id} não encontrada no banco de dados.")
        queue.remove_from_processing_queue(task_id)
        return

    start_time = database.mark_as_processing(task_id)

    try:
        # Encontra o arquivo de áudio
        audio_file_path = file_handler.find_audio_file(task_id)

        # Transcreve o áudio
        result = transcription.transcribe_audio(
            audio_file_path, prompt=doc.get("prompt")
        )

        # Marca como transcrito
        duration = database.mark_as_transcribed(task_id, start_time, result)
        print(f"Tarefa {task_id} transcrita em {duration:.2f} segundos.")

    except Exception as e:
        # Marca como falha e reenfileira
        print(f"Erro ao processar a tarefa {task_id}: {e}")
        database.mark_as_failed(task_id, start_time, e)
        queue.requeue_task(task_id)
        print(f"Tarefa {task_id} falhou e foi reenfileirada.")
        return  # Evita a remoção da fila de processamento abaixo

    # Remove da fila de processamento somente em caso de sucesso
    queue.remove_from_processing_queue(task_id)


def start():
    """Inicia o loop principal do worker."""
    print("Worker iniciado. Aguardando tarefas...")
    while True:
        task_id = queue.get_task_from_queue()
        if task_id:
            process_task(task_id)
        else:
            time.sleep(config.SLEEP_TIME)


if __name__ == "__main__":
    start()

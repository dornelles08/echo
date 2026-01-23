# Whisper Transcription Worker

Este é um serviço de worker Python projetado para processar tarefas de transcrição de áudio de forma assíncrona usando o modelo Whisper da OpenAI. Ele utiliza o Redis como uma fila de mensagens e o MongoDB para armazenar os resultados e o status das transcrições.

## Features

- **Processamento Assíncrono:** Lida com várias tarefas de transcrição de forma eficiente, uma após a outra.
- **Fila de Mensagens com Redis:** Utiliza o Redis para enfileirar e gerenciar as tarefas de transcrição.
- **Armazenamento com MongoDB:** Salva as transcrições, metadados e status no MongoDB para persistência e consulta.
- **Tecnologia Whisper:** Emprega o robusto modelo Whisper da OpenAI para alta precisão nas transcrições.
- **Reenfileiramento Automático:** Tarefas que falham são automaticamente reenfileiradas para nova tentativa.
- **Modelo Configurável:** Permite a seleção de diferentes tamanhos do modelo Whisper através de variáveis de ambiente.

## Pré-requisitos

- Python 3.11+
- Redis
- MongoDB
- [uv](https://github.com/astral-sh/uv) (ou pip)
- FFmpeg

## Instalação

1. **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd worker
    ```

2. **Instale as dependências:**
    O projeto usa `uv` para gerenciamento de dependências.

    ```bash
    uv sync
    ```

    Alternativamente, se você preferir usar `pip`, pode instalar as dependências listadas em `pyproject.toml` manualmente.

## Configuração

1. **Crie um arquivo de ambiente:**
    Copie o arquivo de exemplo `exemplo.env` para `.env` e preencha as variáveis.

    ```bash
    cp exemplo.env .env
    ```

2. **Configure as variáveis de ambiente em `.env`:**
    - `MONGO_URI`: A URI de conexão para o seu banco de dados MongoDB.
        - Exemplo: `mongodb://localhost:27017/whisper_db`
    - `REDIS_URI`: A URI de conexão para o seu servidor Redis.
        - Exemplo: `redis://localhost:6379/0`
    - `MODEL_NAME`: O nome do modelo Whisper a ser usado (e.g., `tiny`, `base`, `small`, `medium`, `large`). O padrão é `medium`.
    - `UPLOAD_DIR`: O diretório onde os arquivos de áudio para transcrição estão localizados. O padrão é `../uploads`.
    - `REDIS_QUEUE`: Nome da fila Redis principal. O padrão é `whisper_queue`.
    - `REDIS_PROCESSING_QUEUE`: Nome da fila Redis para tarefas em processamento. O padrão é `whisper_processing_queue`.
    - `SLEEP_TIME`: Tempo de espera (em segundos) entre as verificações da fila quando está vazia. O padrão é `1`.

## Como Executar

### Localmente

Para iniciar o worker localmente, execute:

```bash
uv run python main.py
```

O worker começará a escutar a fila `whisper_queue` no Redis por novas tarefas.

### Com Docker

Você pode construir e executar o worker usando Docker.

1. **Construa a imagem Docker:**

    ```bash
    docker build -t whisper-worker .
    ```

2. **Execute o container:**
    Certifique-se de que o Docker possa acessar suas variáveis de ambiente, por exemplo, usando um arquivo `.env`.

    ```bash
    docker run --rm --env-file .env whisper-worker
    ```

## Estrutura do Projeto

O projeto foi refatorado para uma arquitetura mais modular, organizada da seguinte forma:

```bash
.
├── main.py
└── src/
    └── worker/
        ├── __init__.py
        ├── config.py
        ├── database.py
        ├── file_handler.py
        ├── queue.py
        ├── transcription.py
        └── worker.py
```

- `main.py`: O ponto de entrada principal do aplicativo, que inicia o worker.
- `src/worker/`: Contém todos os módulos refatorados do worker.
  - `config.py`: Gerencia as variáveis de ambiente e configurações.
  - `database.py`: Encapsula todas as interações com o MongoDB.
  - `file_handler.py`: Lida com a localização dos arquivos de áudio no sistema de arquivos.
  - `queue.py`: Gerencia as operações de fila com o Redis.
  - `transcription.py`: Contém a lógica de carregamento do modelo Whisper e a execução da transcrição.
  - `worker.py`: O orquestrador principal que coordena os outros módulos para processar as tarefas.

## Como Funciona

1. Um produtor (não incluído neste projeto) adiciona um `task_id` à lista `REDIS_QUEUE` (padrão: `whisper_queue`) no Redis. Esse `task_id` deve corresponder ao `_id` de um documento na coleção `transcriptions` do MongoDB.
2. O `worker.py`, através do módulo `queue.py`, pega um `task_id` da fila `REDIS_QUEUE` de forma atômica e o move para a lista `REDIS_PROCESSING_QUEUE` para garantir que apenas um worker processe a mesma tarefa.
3. O `worker.py`, através do módulo `database.py`, atualiza o status da tarefa para `processing` no MongoDB.
4. Ele localiza o arquivo de áudio correspondente no diretório `UPLOAD_DIR` (padrão: `../uploads`) usando o módulo `file_handler.py`. O nome do arquivo de áudio deve começar com o `task_id`.
5. O `transcription.py` transcreve o áudio usando o modelo Whisper. Um `prompt` inicial pode ser fornecido através do documento no MongoDB.
6. Após a conclusão, o `worker.py`, através do módulo `database.py`, atualiza o documento no MongoDB com o status `completed`, o texto da transcrição, o idioma detectado e outras métricas.
7. Se ocorrer um erro, o status é definido como `failed`, o erro é registrado e o `task_id` é reenfileirado na `REDIS_QUEUE` usando o módulo `queue.py`.
8. O `task_id` é removido da `REDIS_PROCESSING_QUEUE` após o processamento (sucesso ou falha).

## Modelo de Dados no MongoDB

As informações das tarefas de transcrição são armazenadas na coleção `transcriptions` com a seguinte estrutura:

```json
{
  "_id": "<task_id>", // ID único da tarefa (string)
  "status": "pending" | "processing" | "completed" | "failed",
  "transcription": "<texto_transcrito>", // (opcional)
  "language": "<idioma_detectado>", // (opcional)
  "model": "<modelo_usado>", // (opcional)
  "prompt": "<prompt_inicial>", // (opcional)
  "created_at": "<data_criacao>",
  "started_at": "<data_inicio_processamento>", // (opcional)
  "finished_at": "<data_fim_processamento>", // (opcional)
  "duration_seconds": "<duracao_em_segundos>", // (opcional)
  "error": "<mensagem_de_erro>" // (opcional)
}
```

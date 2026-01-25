# Echo Backend

Este é o backend da aplicação Echo, um serviço de transcrição de áudio construído com FastAPI.

## Visão Geral

O Echo Backend oferece uma API para gerenciar tarefas de transcrição de áudio. Ele permite o upload de arquivos de áudio, enfileira-os para processamento, armazena os resultados e fornece endpoints para acompanhar o status e o resultado das transcrições.

## Arquitetura

O projeto é estruturado em uma arquitetura de várias camadas para garantir a separação de interesses e a escalabilidade:

- **`main.py`**: O ponto de entrada da aplicação, responsável por iniciar o servidor Uvicorn.
- **`app/main.py`**: Cria e configura a instância do FastAPI, incluindo o ciclo de vida da aplicação para gerenciar conexões com o banco de dados e o Redis.
- **`app/routers`**: Contêm a lógica de roteamento da API. Atualmente, `transcriptions.py` define os endpoints para as operações de transcrição.
- **`app/services`**: Contêm a lógica de negócios. `transcription_service.py` orquestra as operações, como a criação de tarefas e o gerenciamento de arquivos.
- **`app/repositories`**: Responsáveis pela interação com o banco de dados e o Redis. `transcription_repository.py` implementa a lógica para armazenar e recuperar dados de transcrição.
- **`app/models.py`**: Define os modelos de dados Pydantic usados para validação e serialização de dados da API.
- **`app/database.py`**: Gerencia a conexão com o banco de dados MongoDB.
- **`app/redis_client.py`**: Gerencia a conexão com o Redis.
- **`app/config.py`**: Gerencia as configurações da aplicação, carregando variáveis de ambiente de um arquivo `.env`.

### Fluxo de Dados

1. Um cliente envia um arquivo de áudio para o endpoint `POST /transcribe`.
2. O `TranscriptionService` salva o arquivo e cria um novo registro de `Transcription` no MongoDB com o status "pending".
3. O ID da tarefa é então enviado para uma fila no Redis.
4. Um processo de worker (não incluído neste repositório) consome as tarefas da fila do Redis, realiza a transcrição e atualiza o registro no MongoDB com o texto transcrito e o status "completed".
5. Os clientes podem consultar o status e o resultado das transcrições através dos endpoints `GET /transcriptions` e `GET /transcriptions/{task_id}`.

## Endpoints da API

### `POST /transcribe`

Inicia uma nova tarefa de transcrição.

- **Request Body:**
  - `file`: O arquivo de áudio a ser transcrito (como `multipart/form-data`).
  - `prompt` (opcional): Um texto de prompt para guiar o modelo de transcrição.

- **Response:** `200 OK`
  - Retorna o objeto `Transcription` recém-criado.

### `GET /transcriptions`

Lista as transcrições com paginação.

- **Query Parameters:**
  - `skip` (opcional): Número de itens a pular. Padrão: `0`.
  - `limit` (opcional): Número máximo de itens a retornar. Padrão: `20`, Máximo: `100`.

- **Response:** `200 OK`
  - Retorna um objeto `PaginatedTranscriptionSummary` contendo o total de itens e uma lista de resumos de transcrições.

### `GET /transcriptions/{task_id}`

Obtém os detalhes de uma transcrição específica.

- **Path Parameters:**
  - `task_id`: O ID da tarefa de transcrição.

- **Response:** `200 OK`
  - Retorna o objeto `Transcription` completo.
- **Response:** `404 Not Found`
  - Se a transcrição não for encontrada.

### `DELETE /transcriptions/{task_id}`

Exclui uma tarefa de transcrição.

- **Path Parameters:**
  - `task_id`: O ID da tarefa de transcrição a ser excluída.

- **Response:** `204 No Content`
  - Se a exclusão for bem-sucedida.
- **Response:** `404 Not Found`
  - Se a transcrição não for encontrada.

## Começando

### Pré-requisitos

- Python 3.11+
- Docker (para execução em contêiner)
- [uv](https://github.com/astral-sh/uv) para gerenciamento de dependências e ambiente virtual (opcional, se não usar Docker)

### Instalação

1. **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    cd backend
    ```

2. **Crie o arquivo de ambiente:**
    Copie o arquivo `exemplo.env` para `.env` e preencha as variáveis de ambiente necessárias.

    ```bash
    cp exemplo.env .env
    ```

    **`.env`**

    ```bash
    MONGO_URI="mongodb://user:password@host:port"
    REDIS_URI="redis://host:port"
    APP_ENV="development" # ou "production"
    ```

3. **Crie um ambiente virtual e instale as dependências (se não usar Docker):**

    ```bash
    # Instale o uv se ainda não o tiver
    pip install uv

    # Crie e ative o ambiente virtual
    uv venv
    source .venv/bin/activate

    # Sincronize as dependências com o arquivo de lock
    uv sync
    ```

### Executando a Aplicação

#### Localmente

Para executar a aplicação em modo de desenvolvimento com recarregamento automático (garanta que `APP_ENV="development"` esteja no seu arquivo `.env`):

```bash
uv run main.py
```

A API estará disponível em `http://localhost:8000`.

#### Com Docker

Para construir e executar a aplicação usando Docker:

1. **Construa a imagem Docker:**

    ```bash
    docker build -t echo-backend .
    ```

2. **Execute o contêiner:**

    ```bash
    docker run -d -p 8000:8000 --env-file .env --name echo-backend echo-backend
    ```

A API estará disponível em `http://localhost:8000`.

## Estrutura do Projeto

```bash
/
├── app/                  # Contém a lógica principal da aplicação
│   ├── __init__.py
│   ├── config.py         # Configuração da aplicação (variáveis de ambiente)
│   ├── database.py       # Configuração da conexão com o MongoDB
│   ├── main.py           # Ponto de entrada da aplicação FastAPI
│   ├── models.py         # Modelos de dados Pydantic
│   ├── redis_client.py   # Configuração da conexão com o Redis
│   ├── repositories/     # Lógica de acesso a dados
│   ├── routers/          # Endpoints da API
│   └── services/         # Lógica de negócios
├── Dockerfile            # Define a imagem Docker para a aplicação
├── main.py               # Ponto de entrada para execução com Uvicorn
├── pyproject.toml        # Dependências do projeto e metadados
├── README.md             # Este arquivo
└── exemplo.env           # Arquivo de exemplo para variáveis de ambiente
```

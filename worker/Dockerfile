FROM python:3.10-slim

# Instalar FFmpeg (essencial para o Whisper)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar o uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Instalar dependências
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

# O Worker não expõe portas, ele apenas consome do Redis
CMD ["uv", "run", "python", "main.py"]
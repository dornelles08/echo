# Echo Monorepo

Plataforma de processamento de mídia com upload de áudio/vídeo, transcrição com IA, geração de resumos e edição de segmentos.

## 📁 Estrutura

```
/
├── apps/
│   ├── api/          # API Node.js + Fastify + Prisma
│   ├── web/          # React + Vite + TypeScript
│   └── worker/       # Python Worker (transcrição)
├── packages/
│   ├── core/         # Domínio compartilhado (entidades, use cases)
│   └── contracts/     # Schemas Zod e tipos HTTP compartilhados
├── shared-config/     # ESLint, Prettier configs
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Scripts Principais

```bash
# Desenvolvimento
pnpm dev              # Roda API e Web em paralelo
pnpm dev:api          # Apenas API
pnpm dev:web          # Apenas Web
pnpm worker:dev       # Worker Python (cd apps/worker && uv run main.py)

# Build
pnpm build            # Build API e Web
pnpm build:api        # Apenas API
pnpm build:web        # Apenas Web

# Testes
pnpm test             # Testes de API e Web
pnpm test:core        # Testes do package core
pnpm lint             # Lint de todos projetos
pnpm typecheck        # Type checking
```

## 📦 Workspaces

### @echo/core

Pacote compartilhado com domínio da aplicação:

- Entidades e types
- Casos de uso
- Interfaces de repositórios
- Utilitários core

### @echo/contracts

Schemas Zod e tipos para comunicação HTTP:

- Schemas de validação (auth, media)
- Tipos de resposta (MediaResponse, Status, Segment)
- Schemas compartilhados entre API e Web

### apps/api

API REST com Fastify, Prisma e BullMQ:

- Porta 8000
- MongoDB + Redis
- Upload de arquivos
- Autenticação JWT

### apps/web

Frontend React com Vite:

- Porta 3000
- TanStack Router + Query
- TailwindCSS
- Radix UI

### apps/worker

Worker Python para transcrição Whisper:

- Processamento assíncrono
- Fila Redis
- MongoDB storage

## 🐳 Docker

```bash
# Subir todos serviços
docker compose up -d

# Apenas infra
docker compose up -d mongodb redis

# Build específico
docker compose build api
docker compose build worker
```

## 🔧 Desenvolvimento

1. **Instalar dependências:**

   ```bash
   pnpm install
   ```

2. **Variáveis de ambiente:**

   ```bash
   # API
   cp apps/api/.env.example apps/api/.env

   # Worker
   cp apps/worker/exemplo.env apps/worker/.env
   ```

3. **Rodar local:**
   ```bash
   pnpm dev
   ```

## 🧪 Testes

```bash
# Todos os testes
pnpm test

# Apenas API
pnpm test:api

# Apenas Web
pnpm test:web

# Apenas core
pnpm test:core
```

## 📚 Documentação

- [AGENTS.md](./AGENTS.md) - Regras para agentes de código
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia de contribuição
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Visão geral da arquitetura

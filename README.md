# Echo Monorepo

Monorepo com pnpm workspaces contendo API, Web frontend e Worker para processamento de transcrição.

## 📁 Estrutura

```
/
├── apps/
│   ├── api/          # API Bun/Node.js + Fastify + Prisma
│   ├── web/          # React + Vite + TypeScript
│   └── worker/       # Python Whisper worker
├── packages/
│   └── core/         # Domínio compartilhado
├── shared-config/     # ESLint, Prettier configs
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

## 🚀 Scripts Principais

```bash
# Desenvolvimento
pnpm dev              # Roda API e Web em paralelo
pnpm dev:api          # Apenas API
pnpm dev:web          # Apenas Web
pnpm worker:dev       # Worker Python

# Build
pnpm build            # Build API e Web
pnpm build:api        # Apenas API
pnpm build:web        # Apenas Web

# Testes
pnpm test             # Testes de API e Web
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
docker-compose up

# Apenas infra
docker-compose up mongodb redis

# Build específico
docker-compose build api
docker-compose build worker
```

## 🔧 Desenvolvimento

1. **Instalar dependências:**
   ```bash
   pnpm install
   ```

2. **Variáveis de ambiente:**
   ```bash
   # API
   cp apps/api/.env.exemplo apps/api/.env
   
   # Worker
   cp apps/worker/exemplo.env apps/worker/.env
   ```

3. **Rodar local:**
   ```bash
   pnpm dev
   ```

## 📋 Migração Notes

- Backend: Bun → Node.js + pnpm
- Worker: Mantido Python (futura migração TS)
- Core: Extraído para pacote compartilhado
- Configs: ESLint/Prettier centralizados
- Docker: Paths atualizados para nova estrutura
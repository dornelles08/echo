# Contributing Guide

Obrigado por contribuir com este projeto 🚀  
Este documento define o processo oficial para desenvolvimento, PRs e qualidade.

---

## 🎯 Objetivo do Processo

Garantir que:

- mudanças sejam rastreáveis
- código seja testado
- arquitetura não seja quebrada
- o repositório continue organizado

---

## 🧱 Pré-requisitos

- Node.js >= 20
- pnpm instalado
- Docker + Docker Compose
- Python 3.11+ (para o Worker)
- uv (para gerenciar dependências Python do Worker)

---

## 🚀 Setup inicial

```bash
# Instalar dependências
pnpm install

# Criar arquivo de ambiente
cp apps/api/.env.example apps/api/.env

# Subir infraestrutura (MongoDB, Redis)
docker compose up -d

# Iniciar desenvolvimento
pnpm dev

# Para rodar o Worker separadamente
cd apps/worker && uv run main.py
```

---

## 🌿 Padrão de Branches

Use o formato:

- `feature/nome-da-feature`
- `fix/nome-do-bug`
- `hotfix/nome-do-hotfix`
- `chore/nome-da-tarefa`

Exemplo:

- `feature/add-media-upload`
- `fix/transcription-retry-bug`

---

## 🧾 Padrão de Commits

Formato:

- `feat: ...` - nova funcionalidade
- `fix: ...` - correção de bug
- `refactor: ...` - refatoração
- `docs: ...` - documentação
- `test: ...` - testes
- `chore: ...` - tarefas diversas

Exemplos:

- `feat: add media upload endpoint`
- `fix: prevent duplicated queue jobs`

---

## 🧪 Regras de Testes

Antes de abrir PR, rode:

```bash
# Todos os testes
pnpm test

# Apenas API
pnpm test:api

# Apenas Web
pnpm test:web

# Com coverage
pnpm test:api --coverage
```

📌 Obrigatório:

- Features novas devem ter testes
- Correções críticas devem ter teste de regressão

---

## 🧼 Regras de Qualidade

Antes de finalizar qualquer tarefa, rode:

```bash
# Lint
pnpm lint

# Typecheck
pnpm typecheck

# Build
pnpm build
```

Para API especificamente:

```bash
pnpm lint:api
pnpm test:api
pnpm build:api
```

---

## 🗂️ Regras de Organização

📌 Onde colocar código:

- API Routes: `apps/api/src/routes`
- API Services: `apps/api/src/services`
- Infra (DB, Redis): `apps/api/src/infra`
- Jobs/Workers: `apps/worker/`
- Regras de negócio compartilhadas: `packages/core/src`

📌 Regra obrigatória:

> Se for regra de negócio reutilizável entre apps, vai em `packages/core`.

---

## 🗃️ Banco de Dados e Schema

O projeto usa Prisma com MongoDB. Schema está em `apps/api/prisma/schema.prisma`.

Se alterar o schema:

1. Atualize `apps/api/prisma/schema.prisma`
2. Gere o cliente Prisma:

```bash
cd apps/api && pnpm prisma generate
```

---

## 🔍 Padrão de Pull Request

Todo PR deve conter:

### 📌 Descrição

Explique o que foi feito e por quê.

### ✅ Como testar

Liste comandos e passos.

### 🧪 Evidências

- prints
- logs
- payload exemplo
- response exemplo

### ⚠️ Impactos

Se afetar deploy, banco, fila, performance, etc.

---

## 📋 Checklist obrigatório do PR

- [ ] Código compilando (`pnpm build`)
- [ ] Testes passando (`pnpm test`)
- [ ] Lint passando (`pnpm lint`)
- [ ] Typecheck passando (`pnpm typecheck`)
- [ ] Não quebrou compatibilidade
- [ ] Não commitou `.env`
- [ ] Documentação atualizada se necessário

---

## 🚨 Regras de Emergência

Hotfix em produção:

- branch `hotfix/...`
- PR com prioridade máxima
- sempre incluir teste se possível

---

## 🗣️ Comunicação

Caso exista dúvida arquitetural:

- documentar em `docs/adr/`
- ou perguntar ao responsável técnico do projeto

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # inicia api + web
pnpm dev:api          # inicia apenas api
pnpm dev:web          # inicia apenas web

# Worker (Python)
cd apps/worker && uv run main.py

# Limpar node_modules e reinstalar
pnpm clean
```

# AGENTS.md

Este arquivo define regras e padrões obrigatórios para agentes de código (OpenCode, Copilot, Cursor, LLMs, etc.) que forem contribuir neste repositório.

---

## 🎯 Objetivo do Agente

O agente deve:

- implementar funcionalidades seguindo a arquitetura existente
- priorizar consistência sobre criatividade
- evitar criar padrões novos sem necessidade
- minimizar mudanças desnecessárias
- sempre buscar soluções simples e testáveis

---

## 🧠 Contexto do Projeto

### O que esse sistema faz?

Echo é uma plataforma de processamento de mídia que permite usuários fazerem upload de áudios/vídeos. O sistema processa o conteúdo usando Workers Python, transcreve com IA, gera resumos e permite edição de segmentos.

---

## 🧱 Stack e Tecnologias

- Runtime: Node.js 20+ (API/Web), Python (Worker)
- Linguagem: TypeScript, Python
- Framework API: Fastify
- Banco: MongoDB (via Prisma)
- Cache/Fila: Redis / BullMQ
- ORM: Prisma
- Infra: Docker Compose

---

## 🗂️ Estrutura do Repositório

```
apps/api/       -> API principal (Fastify)
apps/web/       -> Aplicação web (Next.js?)
apps/worker/    -> Processamento assíncrono (Python/uv)
packages/core/  -> Regras compartilhadas (TypeScript)
shared-config/  -> Configurações compartilhadas (ESLint, Prettier)
```

---

## 📌 Regras de Organização de Código

### Onde criar cada coisa?

- Controllers / Routes: `apps/api/src/routes`
- Services: `apps/api/src/services`
- Infra (DB, Redis): `apps/api/src/infra`
- Regras de negócio: `packages/core/src`
- Jobs/Filas: `apps/worker/`
- Schemas Prisma: `apps/api/prisma/schema.prisma`

📌 Regra obrigatória:

> Se for regra de negócio reutilizável entre apps, vai em `packages/core`.

---

## 🧩 Convenções de Nome

- arquivos: `kebab-case.ts`
- classes: `PascalCase`
- funções: `camelCase`
- constantes: `UPPER_SNAKE_CASE`
- rotas: `kebab-case`

Exemplos:

- `create-user.route.ts`
- `media.service.ts`
- `video-processing.job.ts`

---

## 🧪 Regras de Teste (Obrigatório)

Toda feature deve ter pelo menos um teste.

### Tipos de teste

- Unitário: regras de negócio (`packages/core`)
- Integração: API e banco

📌 Ao criar um endpoint, o agente deve:

- criar teste de integração OU
- justificar no PR por que não criou

---

## ⚠️ Regras de Segurança

- Nunca logar tokens, senhas, secrets
- Nunca commitar `.env`
- Nunca retornar stacktrace bruto em produção
- Validar payload com schema (zod)

---

## 🔥 Regras de Performance

- Evitar queries N+1
- Evitar processamento pesado dentro de request HTTP
- Processamento pesado deve ir para fila/worker

---

## 🧼 Regras de Qualidade (Obrigatório)

Antes de finalizar qualquer tarefa, rodar:

```bash
pnpm lint
pnpm test
pnpm build
```

Para API especificamente:

```bash
pnpm lint:api
pnpm test:api
pnpm build:api
```

---

## 🚫 Coisas Proibidas

O agente NÃO deve:

- criar nova lib sem justificar
- mudar estilo do projeto inteiro
- refatorar sem motivo
- mexer em código não relacionado à tarefa
- adicionar console.log espalhado (usar logger)
- usar `any` sem justificativa
- commitar arquivos de ambiente (`.env`)

---

## 🧠 Como o agente deve pensar

Antes de implementar algo, responder mentalmente:

1. Qual módulo é responsável por isso?
2. Existe algo parecido no código atual?
3. Precisa ser async ou pode ser sync?
4. Isso precisa de teste?
5. Precisa de migration/schema?

---

## 📦 Padrão de Commits

Formato:

- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `test: ...`
- `docs: ...`
- `chore: ...`

Exemplo:

- `feat: add endpoint to create media`
- `fix: correct redis connection retry`

---

## 📝 Formato ideal de Pull Request

Toda entrega deve incluir:

- descrição do que foi feito
- prints ou exemplos de request/response se for API
- como testar
- possíveis impactos

---

## 📍 Observações Específicas do Projeto

- Usar `zod` para validação de payloads
- Usar `pino` para logging (não console.log)
- Timestamps sempre em UTC
- Usar Prisma para operações de banco
- Worker em Python usa `uv` como package manager
- API usa Fastify com pattern de plugins
- Autenticação via JWT (fastify-jwt)

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # inicia api + web
pnpm dev:api          # inicia apenas api
pnpm dev:web          # inicia apenas web

# Testes
pnpm test             # todos os testes
pnpm test:api         # apenas API
pnpm test:web         # apenas Web

# Lint e build
pnpm lint             # verifica código
pnpm build            # build tudo

# Worker (Python)
cd apps/worker && uv run main.py
```

---

## 📋 Variáveis de Ambiente Importantes

| Variável     | Descrição                 |
| ------------ | ------------------------- |
| DATABASE_URL | MongoDB connection string |
| REDIS_URI    | Redis connection string   |
| JWT_SECRET   | Secret para autenticação  |
| NODE_ENV     | development/production    |

# Architecture Overview

Este documento descreve a arquitetura geral do sistema Echo e como os componentes se conectam.

---

## 🎯 Objetivo da Arquitetura

A arquitetura foi desenhada para:

- separar responsabilidades (API, Worker, Core)
- suportar processamento assíncrono de mídia
- permitir escalabilidade horizontal
- manter regras de negócio centralizadas

---

## 🧠 Visão Geral do Sistema

O sistema é composto por:

- **API (Fastify)**: recebe requisições HTTP, gerencia upload, autenticação e cria jobs
- **Worker (Python)**: processa mídia de forma assíncrona (transcrição, resumo, segmentação)
- **Banco (MongoDB)**: armazena dados e estado do processamento
- **Redis/BullMQ**: controla filas e retry de jobs
- **Storage (Local/S3)**: armazena arquivos de mídia enviados e processados

---

## 🗂️ Estrutura do Monorepo

```
apps/
  api/           -> API principal (Fastify/TypeScript)
  web/          -> Aplicação web (Next.js?)
  worker/       -> Processamento assíncrono (Python/uv)
packages/
  core/         -> Regras compartilhadas (TypeScript)
shared-config/  -> Configurações compartilhadas (ESLint, Prettier)
```

### apps/api

Responsável por:

- endpoints REST
- autenticação JWT
- validação de payloads (zod)
- upload de arquivos
- criação e monitoramento de jobs

### apps/web

Responsável por:

- interface web do sistema
- upload e visualização de mídia
- listagem e edição de transcrições

### apps/worker

Responsável por:

- consumir filas BullMQ
- processar transcrições com IA
- gerar resumos automáticos
- segmentar áudio
- atualizar status no banco

### packages/core

Responsável por:

- regras de negócio reutilizáveis
- validações e entidades
- schemas Zod
- utilities

---

## 🔄 Fluxo Principal (Request -> Processamento)

### Fluxo resumido

1. Cliente faz upload de áudio/vídeo via API
2. API salva metadata no MongoDB e cria job na fila
3. Worker consome o job da fila
4. Worker processa transcrição com IA
5. Worker gera resumo automaticamente
6. Worker segmenta o áudio
7. Worker atualiza status e resultados no banco
8. API disponibiliza status, transcrição e resumos

---

## 🧩 Principais Domínios do Sistema

- **Media**: upload, storage, gerenciamento de arquivos
- **Transcription**: conversão de áudio para texto com IA
- **Summary**: geração automática de resumos
- **Segments**: edição e segmentação de áudio
- **Users**: autenticação e permissões
- **Jobs**: fila, status, retry

---

## 🗃️ Banco de Dados

### Entidades principais

- **users**: usuários do sistema (autenticação)
- **medias**: arquivos de mídia enviados (áudio/vídeo)
- **segments**: segmentos editáveis da transcrição

### Regras importantes

- timestamps sempre em UTC
- nunca deletar dados críticos

### Schema Prisma

O schema está em `apps/api/prisma/schema.prisma`

---

## 🧵 Sistema de Filas e Retry

### Como funciona o retry

- retry automático com backoff exponencial
- após falha máxima, marcar como `failed`
- jobs podem ser reprocessados manualmente

### Tipos de jobs

- `transcribe`: transcrição de áudio
- `summarize`: geração de resumo
- `segment`: segmentação de áudio

---

## 🔐 Autenticação e Autorização

- JWT com expiração configurável
- fastify-jwt para gerenciamento
- Roles: admin/user (em desenvolvimento)

---

## 🧪 Testes e Qualidade

### Estratégia de testes

- Unit tests em `packages/core`
- Integration tests na API (Vitest)
- Testes de pipelines críticos no Worker

### Comandos

```bash
pnpm test         # todos os testes
pnpm test:api     # apenas API
pnpm lint         # linting
pnpm build        # build
```

---

## 📦 Deploy e Ambientes

### Ambientes

- dev (desenvolvimento local)
- staging
- production

### Serviços necessários

- MongoDB
- Redis
- Storage (Local ou S3)

### Observações

- Workers podem escalar horizontalmente
- API pode ser stateless
- Redis compartilhado entre API e Worker

---

## 🧭 Convenções Arquiteturais

### Regras obrigatórias

- Regras de negócio ficam em `packages/core`
- API só orquestra e valida
- Worker só processa e atualiza status
- Nada pesado roda dentro de endpoint HTTP
- Timestamps sempre em UTC
- Usar `pino` para logging (não console.log)
- Usar `zod` para validação de payloads

---

## 🚨 Pontos Críticos do Sistema

- Processamento de IA pode ser lento
- Uploads grandes podem impactar memória
- Concorrência do worker deve ser controlada
- Rate limiting pode ser necessário em produção

---

## 📍 Decisões Arquiteturais Importantes

- Usamos BullMQ para filas (retry, delayed jobs)
- Usamos Prisma com MongoDB para persistência
- Usamos monorepo para reutilizar core e tipos
- Worker em Python para integração com libs de IA
- API em Fastify por performance

---

## 🔮 Melhorias Futuras

- Adicionar observabilidade (OpenTelemetry)
- Cache de resultados de transcrição
- Rate limiting
- Autenticação com OAuth
- Upload para S3
- workers separados por tipo de job

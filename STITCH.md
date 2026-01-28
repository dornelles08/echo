# 🎨 PROMPT PARA STITCH (GERAÇÃO DE LAYOUT / FIGMA)

> **Contexto geral do projeto**
> Crie o design completo de uma aplicação web moderna chamada **Echo**, focada em **transcrição de áudio e vídeo, processamento por IA e geração de resumos em Markdown com exportação para PDF**.
> O produto é técnico, mas precisa ser **simples, limpo, confiável e produtivo**, voltado para usuários que lidam com muitos áudios e vídeos (estudantes, pesquisadores, desenvolvedores, criadores de conteúdo, profissionais administrativos).

O visual deve ser:

* Moderno
* Clean
* Profissional
* Com foco em produtividade
* Dark mode friendly (preferência, mas prever light mode)

Use **layout desktop-first**, responsivo.

## 🧱 ESTRUTURA GERAL DO PRODUTO

A aplicação possui:

* Landing Page (marketing)
* Página de Planos
* Login
* Cadastro
* Dashboard (listagem de mídias)
* Criação de nova mídia
* Página de detalhes da mídia
* Fluxo de resumo (prompt/template)
* Visualização de Markdown
* Download de PDF

## 🟢 1. LANDING PAGE (Página inicial)

### Objetivo

Explicar claramente:

* O que o produto faz
* Como funciona
* Para quem é
* Principais benefícios
* Converter o usuário (CTA)

### Estrutura da Landing Page

#### 🔹 Hero Section

* Headline forte:
  > **Transforme áudio e vídeo em texto inteligente, resumos e PDFs em minutos**
* Subheadline:
  > Envie um áudio ou vídeo, transcreva automaticamente e gere resumos em Markdown usando IA — tudo em um só lugar.
* CTA primário:
  * **Começar agora**
* CTA secundário:
  * **Ver como funciona**
* Ilustração ou mockup do dashboard

#### 🔹 Seção: Como funciona (Step by Step)

Cards horizontais ou timeline:

1. **Envie seu áudio ou vídeo**
   * Upload de arquivos de áudio ou vídeo
2. **Processamento automático**
   * Conversão de vídeo para áudio
   * Transcrição com IA
3. **Gere resumos inteligentes**
   * Use templates prontos ou escreva seu próprio prompt
4. **Exporte em Markdown ou PDF**
   * Pronto para estudar, arquivar ou compartilhar

#### 🔹 Seção: Principais Funcionalidades

Grid de cards com ícones:

* 🎙️ Upload de Áudio
* 🎥 Upload de Vídeo (com extração automática de áudio)
* 🧠 Transcrição com IA
* ✍️ Prompt personalizado por mídia
* 📄 Templates prontos de resumo
* 🧾 Geração de Markdown
* 📥 Download em PDF
* 🏷️ Tags e organização
* 📊 Status de processamento em tempo real

#### 🔹 Seção: Para quem é

Cards por persona:

* Estudantes
* Pesquisadores
* Criadores de conteúdo
* Profissionais administrativos
* Desenvolvedores

#### 🔹 CTA Final

* Headline:
  > Comece a organizar seus áudios hoje
* Botão:
  **Criar conta gratuita**

## 💳 2. PÁGINA DE PLANOS

### Estrutura

Tabela comparativa:

#### Plano Free

* Limite de mídias
* Transcrição básica
* Markdown

#### Plano Pro

* Mais minutos
* Templates
* Exportação em PDF
* Prioridade no processamento

#### Plano Advanced

* Uso intensivo
* Múltiplos prompts
* Histórico ilimitado

Botões:

* **Escolher plano**
* **Começar grátis**

## 🔐 3. LOGIN

Tela simples e objetiva:

* Logo
* Título: **Entrar**
* Campos:
  * Email
  * Senha
* Botão: **Entrar**
* Links:
  * Criar conta
  * Esqueci minha senha

## 📝 4. CADASTRO

### Campos

* Nome
* Email
* Senha
* Confirmação de senha

### Campo especial

**Prompt padrão do usuário (opcional)**
Texto auxiliar:

> Descreva como você geralmente quer que seus áudios sejam interpretados.
> Exemplo: “Esses áudios costumam ser reuniões técnicas e eu quero resumos objetivos.”

Botão:

* **Criar conta**

## 📊 5. DASHBOARD (PÓS-LOGIN)

### Header

* Logo
* Botão **Nova mídia**
* Perfil do usuário

### Listagem de mídias (TABELA)

Colunas:

* Nome do arquivo
* Tipo (Áudio / Vídeo)
* Status:
  * Enviado
  * Convertendo vídeo
  * Transcrevendo
  * Transcrito
  * Resumo gerado
* Duração
* Tags
* Data de criação
* Ações:
  * Ver detalhes
  * Apagar

### Botão principal

* **+ Nova mídia**

## ➕ 6. MODAL / TELA: CRIAR NOVA MÍDIA

### Campos

* Upload de arquivo (áudio ou vídeo)
* Nome do arquivo (preenchido automaticamente)
* Tipo (detectado automaticamente)
* Tags
* Prompt contextual da mídia:
  > Descreva o contexto desse áudio/vídeo para melhorar a transcrição

Botões:

* **Enviar**
* **Cancelar**

## 📄 7. TELA DE DETALHES DA MÍDIA

### Seções

#### 🔹 Informações da mídia

* Nome
* Tipo
* Status detalhado:
  * Conversão de vídeo → áudio
  * Transcrição
  * Resumo
* Duração
* Tags

#### 🔹 Transcrição

* Área scrollável
* Status:
  * Em processamento
  * Finalizada

#### 🔹 Geração de Resumo

* Opção:
  * Usar template pronto (dropdown)
  * Escrever prompt manual
* Botão:
  * **Gerar resumo**

#### 🔹 Resultado

* Visualização do Markdown renderizado
* Botões:
  * **Download PDF**
  * **Copiar Markdown**

## 🎨 ESTILO VISUAL

* Tipografia moderna (Inter / SF-like)
* Ícones simples
* Cores:
  **Base**
  * Background light: `#F5F4F2` (off-white quente)
  * Background dark: `#141414` (grafite profundo)
  * Surface: `#1E1E1E`

  **Primária**
  * Slate Green: `#4A6F68`
    → lembra organização, calma, natureza

  **Secundária**
  * Warm Clay: `#C7A17A`

  **Texto**
  * Texto primário light: `#1C1C1C`
  * Texto primário dark: `#ECECEC`
  * Texto secundário: `#8A8A8A`

  **Feedback**
  * Sucesso: `#6E9F87`
  * Aviso: `#D6A85D`
  * Erro: `#C26B6B`
* Feedback visual de status (badges, loaders)
* UX focado em clareza e produtividade

## 🎯 OBJETIVO FINAL DO DESIGN

Criar um **produto profissional**, com cara de SaaS sério, fácil de usar, que transmita:

* Organização
* Inteligência
* Confiabilidade
* Eficiência

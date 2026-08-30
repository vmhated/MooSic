# MooSic 🎵

> Plataforma de Descoberta e Reprodução Musical responsiva, moderna e imersiva preparada para Web, PWA e futuramente Android APK.

---

## 📌 O que é o MooSic?

O **MooSic** é uma aplicação de reprodução de música, suporte a letras (simples e sincronizadas em estilo LRC) e descoberta musical. O projeto foi projetado desde a base para ter uma arquitetura extremamente modular, escalável e agnóstica a provedores de conteúdo de áudio ou metadados de terceiros.

---

## 🚀 Tech Stack

* **Core**: React 18+ (TypeScript)
* **Build Tool**: Vite
* **Estilização**: Tailwind CSS (com Design Tokens em TypeScript)
* **Arquitetura**: Provider Pattern (Inversão de Dependência) + Clean Architecture
* **Ambiente Target**: Web Responsivo, PWA e empacotamento Mobile (Android via Capacitor/PWA)

---

## 🏗️ Visão Geral da Arquitetura

O MooSic segue uma separação rigorosa de responsabilidades:

```text
UI (Pages, Components)
        ↓
Services (Domain Business Logic & Orchestration)
        ↓
Provider Interfaces (IMusicProvider, IAudioProvider, ILyricsProvider)
        ↓
Concrete Providers (MusicBrainz, Jamendo, Custom APIs, Mocks)
```

Para detalhes completos da arquitetura, consulte:
* 📄 [`docs/architecture/README.md`](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/docs/architecture/README.md) - Arquitetura de Software e Regras de Dependência.
* 📄 [`docs/decisions/README.md`](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/docs/decisions/README.md) - Registro de Decisões Arquiteturais (ADR).

---

## 💻 Como Executar Localmente

### Pré-requisitos
* Node.js v18+ 
* npm v9+

### Passos
1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Crie o arquivo de variáveis de ambiente com base no exemplo:
   ```bash
   cp .env.example .env
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação no navegador em `http://localhost:3000`.

---

## ⚙️ Variáveis de Ambiente

As principais variáveis configuráveis no `.env`:
* `VITE_MUSIC_PROVIDER`: Provedor ativo de busca e catálogo musical (`mock`, `musicbrainz`, etc.).
* `VITE_AUDIO_PROVIDER`: Provedor ativo de streaming de áudio.
* `VITE_LYRICS_PROVIDER`: Provedor ativo para letras simples e sincronizadas.
* `VITE_METADATA_PROVIDER`: Provedor ativo de metadados enriquecidos.

---

## 🎯 Próximos Passos (Roadmap Incremental)

1. **Fase 1 (Atual)**: Fundação e Estrutura Arquitetural Básica ✅
2. **Fase 2**: Implementação dos Provedores Mock e Player Global Simulado.
3. **Fase 3**: Layouts Responsivos (Sidebar, Bottom Navigation e Player Bar).
4. **Fase 4**: Integração com Provedores Reais (MusicBrainz / Jamendo).
5. **Fase 5**: Suporte a Letras Sincronizadas (Parser LRC) e Identidade Visual Dinâmica baseada na capa da faixa.

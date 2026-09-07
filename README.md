<div align="center">
  <img src="public/logo.png" alt="MooSic Logo" width="300"/>
  <h1>MooSic</h1>
  <p><strong>A Next-Generation Music Streaming Engine & Audio Intelligence Platform</strong></p>
</div>

---

## 🎵 Visão Geral

**MooSic** é uma plataforma de streaming contemporânea desenvolvida com foco em alta fidelidade acústica, inteligência musical e arquitetura de software limpa (Clean Architecture). Diferente de reprodutores convencionais, o MooSic analisa o **DNA Sonoro** de seus usuários, realiza buscas federadas em tempo real em múltiplos catálogos globais e proporciona uma experiência imersiva através de sintonização harmônica (Web Audio API) e interfaces em *Dark Glassmorphism*.

> *"O MooSic não apenas reproduz músicas. Ele entende a essência cultural e a sessão musical do usuário."*

---

## ✨ Recursos Core & Engenharia de Produto

* 🎧 **Core Player Desacoplado & Hi-Fi:** Mecanismo de estado de áudio de alta precisão (`currentTime` a cada 100ms) isolado via `useSyncExternalStore`. Essa abordagem garante 0% de re-renders desnecessários na interface, protegendo o sistema contra *race conditions* em trocas rápidas de faixas (A → B → C).
* 🧠 **Taste Profile & Tagueamento Cultural:** Sistema de onboarding inteligente integrado à API do **MusicBrainz**. O MooSic extrai tags culturais, subgêneros e origens geográficas (ex: *Synthpop, Manguebeat, UK*) para construir matrizes de recomendação altamente semânticas.
* 🎼 **Top Tracks Architecture:** Prevenção absoluta contra poluição de catálogo. As consultas de recomendação são orientadas diretamente a IDs oficiais de provedores, garantindo 100% de precisão de discografia original e eliminando covers ou faixas falsamente atribuídas.
* 📜 **Sincronia Lírica em Tempo Real:** Integração contínua com provedores de metadados LRC. Renderiza letras sincronizadas via auto-scroll, suportando *seek* dinâmico com tratamento inteligente para arranjos instrumentais.
* 🧬 **Playlist DNA Engine:** Mapeamento espectral avançado. O motor calcula e plota em tempo real atributos como *Energia Sonora, Atmosfera, Dançabilidade* e *Presença Vocal*, definindo arquétipos sonoros para qualquer playlist.
* 🌌 **MooSic Resonator (Harmonic Tuning):** Síntese paralela via **Web Audio API**. Capacidade de sobrepor frequências de Solfeggio (ex: 432Hz, 528Hz), Ondas Alpha e Brown Noise de forma procedural, enriquecendo o foco do ouvinte.
* 🔐 **Autenticação & Estado Descentralizado:** Infraestrutura conectada ao **Supabase**, garantindo persistência de histórico, *Taste Profiles* e sessões de escuta em tempo real.

---

## 🏗️ Arquitetura de Software

O MooSic implementa o **Provider Pattern** acoplado a uma variação de **Clean Architecture**, permitindo que o serviço de música interno seja completamente agnóstico à origem do áudio (Deezer, iTunes, MusicBrainz, YouTube).

### The Federated Hybrid Engine
Nosso orquestrador de catálogos consulta simultaneamente APIs de alta disponibilidade, agregando capas de estúdio (1000x1000px) e metadados densos em tempo real com deduplicação sob demanda (On-the-fly Deduplication).

```text
                     ┌───────────────────────────────────┐
                     │     UI (Pages, Components, Views) │
                     └─────────────────┬─────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌─────────────────────────┐                             ┌─────────────────────────┐
│  Player Control State   │                             │  Player Progress Store  │
│ (Track, Queue, Context) │                             │ (useSyncExternalStore)  │
└───────────┬─────────────┘                             └─────────────────────────┘
            │
            ├───────────────┬────────────────────────┐
            ▼               ▼                        ▼
┌──────────────────┐ ┌──────────────┐       ┌──────────────────┐
│  Listening Event │ │ Playlist DNA │       │ Audio Engine     │
│  Tracker Service │ │ Engine       │       │ (YouTube/HTML5)  │
└───────────┬──────┘ └──────────────┘       └──────────────────┘
            │
            ▼
┌──────────────────┐
│ Taste Profile DB │ (MusicBrainz Enrichment & Supabase Persistence)
└──────────────────┘
```

---

## 🚀 Stack Tecnológico

A plataforma foi construída com as tecnologias mais modernas e robustas do ecossistema Web:

* **Framework & Core:** React 18+ com TypeScript 5+ (Tipagem Estrita)
* **Build System:** Vite (Fast HMR & Optimized Bundling)
* **Estilização UI/UX:** Tailwind CSS (Design Tokens, Glassmorphism, Micro-interações)
* **Gerenciamento de Estado:** React Context + `useSyncExternalStore`
* **Processamento de Sinal:** Web Audio API (Analysers, Biquad Filters, Gain Nodes)
* **Backend as a Service (BaaS):** Supabase (PostgreSQL, Auth, RLS)
* **Integrações Externas:** Deezer API, Apple Music Search, MusicBrainz Open Data, LRCLIB.

---

## 💻 Ambiente de Desenvolvimento

### Pré-requisitos
* Node.js v18 ou superior
* npm v9 ou superior
* (Opcional) Conta Supabase para persistência de dados.

### Instalação Rápida

1. **Clonando o repositório:**
   ```bash
   git clone https://github.com/vmhated/MooSic.git
   cd MooSic
   ```

2. **Instalando dependências:**
   ```bash
   npm install
   ```

3. **Iniciando o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessando a Aplicação:**
   - Interface Principal (Web Player): `http://localhost:3000/app`
   - Landing Page Institucional: `http://localhost:3000/`

---

## 🧪 Qualidade de Código & Deploy

* **Validação Estática (TypeScript):**
  ```bash
  npx tsc --noEmit
  ```
* **Build de Produção (Bundling):**
  ```bash
  npm run build
  ```

---

<div align="center">
  <p>Construído com extrema precisão algorítmica e paixão pela acústica.</p>
  <p><strong>© 2026 MooSic - Premium Audio Streaming.</strong></p>
</div>

# MooSic 🎵

> **"O MooSic não apenas reproduz músicas. Ele entende a sessão musical do usuário."**

Plataforma contemporânea de reprodução, imersão acústica e inteligência musical. Construída com arquitetura limpa, desacoplamento de alta performance, síntese harmônica via Web Audio API e diagnóstico de DNA sonoro.

---

## ✨ Destaques da Plataforma

* 🎧 **Core Player Desacoplado & Hi-Fi:** Estado de alta frequência (`currentTime` a cada 100ms) isolado via `useSyncExternalStore`, eliminando 100% dos re-renders desnecessários em páginas e listas. Protegido contra *race conditions* em trocas rápidas de faixas (A → B → C).
* 📜 **Letras Sincronizadas com Auto-Scroll:** Integração com provedores LRC (LRCLIB), com suporte a seek ao clicar no verso e tratamento para faixas instrumentais ou sem letra cadastrada.
* 🧬 **Playlist DNA Engine:** Diagnóstico espectral de listas em tempo real, calculando índices de *Energia Sonora*, *Atmosfera & Espaço*, *Dançabilidade*, *Presença Vocal*, *BPM Médio* e arquétipos sonoros (ex: *⚡ Pulso Eletrizante & Beat Urbano*).
* 📖 **Inteligência de Sessão & Histórico ("Session Story"):** Rastreamento comportamental com detecção de *Skip Rápido* (< 25s), *Conclusão Relevante* (≥ 85%), consolidação automática por inatividade e síntese narrativa editorial (*"Sua Última Sessão"*).
* 🌌 **MooSic Resonator (Harmonic Tuning):** Síntese paralela contínua via Web Audio API com frequências de solfeggio e ruído de foco (432Hz, 528Hz, Ondas Alpha 10Hz e Brown Noise) com osciloscópio visual.
* 🔐 **Sistema de Autenticação Refinado:** Experiência moderna em *dark glassmorphism*, suportando login, cadastro de novos ouvintes e acesso com 1 clique como Convidado VIP.

---

## 🏗️ Arquitetura de Software

O MooSic adota uma arquitetura em camadas orientada a domínio (Clean Architecture + Provider Pattern):

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
│  Session Service │ (Consolidação de Sessões & Narrativas Temporais)
│   & History      │
└──────────────────┘
```

### Principais Módulos do Código-Fonte:

```text
src/
├── app/
│   ├── layouts/          # Layout mestre (AppLayout, Sidebar, Topbar)
│   └── routes/           # Roteamento por hash e histórico de navegação
├── components/
│   ├── lyrics/           # Painel de letras sincronizadas e visualizador
│   ├── modals/           # Modais (AuthModal, CreatePlaylist, Resonator, AddToPlaylist)
│   ├── navigation/       # Topbar dinâmica, perfil de usuário e Sidebar
│   ├── player/           # PersistentBottomPlayer (scrubber isolado e áudio 3D)
│   ├── playlist/         # PlaylistDNABar (gráficos de DNA e métricas de áudio)
│   └── session/          # LastSessionRecap (card editorial da última sessão)
├── features/
│   ├── home/             # Spotlight Billboard e carrosséis horizontais
│   ├── search/           # Busca universal e estações temáticas de gêneros
│   ├── library/          # Músicas Curtidas, Histórico de Escuta e Sessões
│   ├── playlists/        # Visualizador e gerenciador de playlists autorais
│   └── landing/          # Landing Page editorial imersiva de alta fidelidade
├── providers/            # Adaptadores de conteúdo (Music, Lyrics, Audio)
├── services/
│   ├── audio/            # Motores de áudio (YouTube IFrame, Resonator Web Audio)
│   ├── music/            # Orquestrador de catálogos e desambiguação
│   ├── playlist/         # Motor de cálculo determinístico de Playlist DNA
│   └── session/          # Rastreador de eventos de escuta e agregador de sessões
└── stores/               # Contextos de estado (Player, Progress, Auth, Playlists)
```

---

## 🚀 Tech Stack

* **Core:** React 18+ (TypeScript 5+)
* **Build Tool:** Vite
* **Estilização:** Tailwind CSS (com Design Tokens em TypeScript e Glassmorphism)
* **Gerenciamento de Estado:** React Context + `useSyncExternalStore` (para desempenho sem re-renders)
* **Motor de Áudio:** Web Audio API (Osciladores, Nós de Ganho, Analisadores de Frequência, Áudio 3D) + YouTube IFrame API
* **Ícones:** Lucide React

---

## 💻 Como Executar Localmente

### Pré-requisitos
* Node.js v18 ou superior
* npm v9 ou superior

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/vmhated/MooSic.git
   cd MooSic
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   - Landing Page: `http://localhost:3000/#/`
   - Web Player: `http://localhost:3000/app#/app`

### Comandos de Validação

* **Verificação de Tipagem (TypeScript):**
  ```bash
  npm run lint
  # ou
  npx tsc --noEmit
  ```

* **Build de Produção:**
  ```bash
  npm run build
  ```

---

## 📄 Documentação Técnica e Especificações

* 📘 [`docs/architecture/MOOSIC_PRODUCT_SPEC.md`](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/docs/architecture/MOOSIC_PRODUCT_SPEC.md) — Visão completa de produto, taxonomia, jornadas de usuário e modelos de dados.
* 📙 [`docs/architecture/MOOSIC_TECHNICAL_AUDIT.md`](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/docs/architecture/MOOSIC_TECHNICAL_AUDIT.md) — Auditoria técnica detalhada e status de implementação das etapas P0 e P1.

---

Desenvolvido com paixão e precisão acústica para elevar a experiência do streaming de áudio.

# Relatório de Auditoria Técnica & Diagnóstico Arquitetural — MooSic
**Data:** 05 de Setembro de 2026  
**Autor:** Principal Product Designer & Lead Product Architect  
**Documento Alvo:** `docs/architecture/MOOSIC_TECHNICAL_AUDIT.md`  
**Escopo:** Avaliação do código real do repositório em comparação com a nova especificação (`MOOSIC_PRODUCT_SPEC.md`).  
**Regra de Ouro:** *Diagnóstico e planejamento puros — nenhuma alteração de código ou refatoração destrutiva prematura.*

---

## 1. Executive Summary

O **MooSic** já possui uma fundação funcional sólida e moderna em termos de **Landing Page editorial**, **interface do Web Player** (Spotlight Billboard, carrosséis horizontais Spotify-style, navegação responsiva), **resolução e streaming de áudio real** (orquestração híbrida YouTube IFrame Engine + HTML5 Audio preview) e **síntese harmônica paralela** (MooSic Resonator com Web Audio API).

Contudo, sob a ótica da nova visão do produto (*"O MooSic não apenas reproduz músicas. Ele entende a sessão musical do usuário"*), o projeto encontra-se em um estágio puramente transacional. **Nenhum dos sistemas de inteligência de sessão, análise de DNA sonoro, fila inteligente explicável ou cartografia musical existe atualmente no código.**

### Principais Achados:
1. **Gargalo Crítico de Re-renderização no Player:** O tempo decorrido da música (`currentTime`) é mantido no mesmo React Context que armazena `currentTrack`, `playbackState` e a fila (`queue`). Como o motor de áudio emite atualizações a cada 100ms (10 vezes por segundo), **todas as páginas principais (`HomePage`, `SearchPage`, `PlaylistView`, `LibraryPage`, `AppLayout`) sofrem re-renders contínuos e desnecessários durante a reprodução.**
2. **Ausência Total do Subsistema de Sessões e Eventos:** Não existem modelos nem serviços para rastrear `ListeningEvent`, `ListeningSession`, `SessionStory`, `PlaylistDNA` ou `TasteProfile`.
3. **Fila Primitiva:** A fila é um simples array linear `Track[]` sem diferenciação entre intenção manual e sugestões de algoritmo, e sem metadados de justificativa (*"Por que essa música?"*).
4. **Resíduos Arquiteturais e Código Morto:** Existem arquivos órfãos criados em fases embrionárias que não são importados por ninguém (`src/hooks/usePlayer.ts`, `src/hooks/useTheme.ts`, `src/stores/playerStore.ts`, `src/stores/themeStore.ts`, `src/services/audio/audioService.ts`).
5. **Abstração de Providers Incompleta:** Existem contratos de interface para `IMusicProvider`, `ILyricsProvider`, `IAudioProvider` e `IMetadataProvider`, mas faltam completamente abstrações para `IRecommendationProvider` e `IAnalyticsProvider`.

---

## 2. Current Architecture (Mapeamento do Código Existente)

Abaixo está o inventário de todos os componentes do sistema com seus respectivos status reais de implementação:

| Subsistema / Módulo | Caminho Real no Repositório | Status | Diagnóstico Técnico |
| :--- | :--- | :---: | :--- |
| **Landing Page** | `src/features/landing/` | 🟢 Sólido | Experiência imersiva rica (Hero, Artwork Carousel, StoryLyrics, PlayerPreview, Footer). Totalmente funcional. |
| **Home Page (Player)** | `src/features/home/HomePage.tsx` | 🟢 Sólido | Spotlight Billboard cinemático e 4 carrosséis temáticos proporcionais. Visual de padrão internacional. |
| **Busca & Descoberta** | `src/features/search/SearchPage.tsx` | 🟢 Sólido | Busca ao vivo em catálogo global (Deezer/iTunes) + Hub interativo de 8 estações de gênero com cache em memória. |
| **Player Persistente** | `src/components/player/PersistentBottomPlayer.tsx` | 🟡 Parcial | Barra inferior contínua, áudio 3D, scrubber e volume. Sofre com re-renderizações e ticker de ondas pesado. |
| **Painel de Letras** | `src/components/lyrics/LyricsPanel.tsx` | 🟢 Sólido | Auto-scroll suave, seek por verso e tratamento para faixas sem letra (*"Ainda não sabemos cantar essa"*). |
| **Playlists Customizadas** | `src/features/playlists/PlaylistView.tsx` | 🟢 Sólido | Criação, temas dinâmicos (Sunset, Cyberpunk, etc.), edição e persistência em `localStorage`. |
| **Biblioteca Pessoal** | `src/features/library/LibraryPage.tsx` | 🟡 Parcial | Exibe faixas curtidas com base em IDs. Carece de filtros, ordenação e histórico. |
| **Motor de Áudio Real** | `src/services/audio/youtubeAudioEngine.ts` | 🟢 Sólido | Player oculto via YouTube IFrame API com resolução automática e fallback para HTML5. |
| **Ressonador Harmônico** | `src/services/audio/binauralResonatorService.ts` | 🟢 Sólido | Síntese de 432Hz, 528Hz, Alpha 10Hz e Brown Noise via Web Audio API com osciloscópio. |
| **Resolução de Áudio** | `src/services/audio/audioResolverService.ts` | 🟢 Sólido | Cache duplo (RAM + LocalStorage) e query de desambiguação automática de áudio. |
| **Provedores de Música** | `src/providers/music/` | 🟢 Sólido | `IMusicProvider` com adaptadores para Deezer, iTunes, MusicBrainz e Mock. |
| **Provedores de Letras** | `src/providers/lyrics/` | 🟢 Sólido | `ILyricsProvider` com implementação real consumindo LRCLIB. |
| **Provedores de Áudio** | `src/providers/audio/IAudioProvider.ts` | 🟠 Refatorar | Interface existe, mas não é usada pelo player (o player usa diretamente os services). |
| **Provedor de Metadata** | `src/providers/metadata/IMetadataProvider.ts` | 🟡 Parcial | Interface existe, mas desacoplada da cadeia de enriquecimento de áudio. |
| **Provedor de Recomendação** | `src/providers/recommendation/` | ⚪ Inexistente | Nenhuma interface ou provider de recomendação criado. |
| **Provedor de Analytics** | `src/providers/analytics/` | ⚪ Inexistente | Nenhuma camada para registrar métricas analíticas de escuta. |
| **Listening Sessions** | — | ⚪ Inexistente | Não há detecção de sessões nem consolidação de narrativa temporal. |
| **Listening Events** | — | ⚪ Inexistente | Nenhum tracking estruturado de skips, tempo até skip ou conclusões de faixa. |
| **Playlist DNA** | — | ⚪ Inexistente | Playlists possuem apenas temas visuais, sem análise de energia ou métricas de áudio. |
| **Smart Queue** | — | ⚪ Inexistente | Fila é um array estático sem sugestões automatizadas justificadas. |
| **Cartografia / Stats** | `src/features/discovery/`, `profile/` | ⚪ Inexistente | As pastas existem mas possuem apenas `export {};`. Nenhuma tela de estatísticas ativa. |
| **Contexto do Player** | `src/stores/playerContext.tsx` | 🟠 Refatorar | Contexto monolítico acumulando áudio, fila, likes e `currentTime` de alta frequência. |
| **Código Morto / Órfão** | `src/hooks/usePlayer.ts`, `useTheme.ts`, etc. | 🔴 Reconstruir / Limpar | Arquivos desacoplados sem uso real que geram ambiguidade arquitetural. |

---

## 3. Player Audit (Auditoria Específica do Player)

### 3.1. Estado Global e Fonte da Verdade
* **Fonte Única:** O estado de reprodução é mantido no `PlayerContext` (`src/stores/playerContext.tsx`). Não há múltiplas instâncias de áudio conflitantes.
* **Persistência Global:** O player é persistente porque o `PlayerProvider` envolve todo o `RouterProvider` no nível de [App.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/App.tsx). A navegação entre rotas (`/app`, `/app/search`, `/app/playlist/:id`) não desmonta o player nem pausa o áudio.
* **Motor Híbrido:** O player opera com dois motores alternativos:
  1. `youtubeAudioEngine` (prioritário para faixas completas de estúdio via YouTube IFrame API).
  2. `audioRef.current` (instância de `HTMLAudioElement` para previews e fallback).

### 3.2. Análise Funcional de Controles:
* **Play / Pause / Resume:** Funciona perfeitamente sincronizado com ambos os motores.
* **CurrentTime / Duration:** Sincronizados através do ticker de 100ms do YouTube e eventos `timeupdate`/`durationchange` do HTML5.
* **Seek:** Funciona de maneira linear (`seekTo`), atualizando o motor ativo e o estado local.
* **Volume / Mute:** Controla ambos os motores em paralelo e persiste o volume em `localStorage` (`moosic_volume`).
* **Next / Previous:** Lógica presente, respeitando `repeatMode` ('off', 'all', 'one') e `isShuffle`.
* **Fila (`queue`):** Manipulada como lista plana `Track[]`.
  - *Problema:* `setQueue` substitui toda a fila. Não há histórico de faixas já tocadas versus faixas futuras.
* **Contexto de Reprodução (`PlaybackContext`):** A interface existe em `src/types/domain/player.ts`, mas **nunca é preenchida** no `playerContext.tsx`. O player não sabe se está tocando a partir de um álbum, de uma busca ou de uma playlist específica.

### 3.3. Race Conditions e Sincronização:
* **Race Condition na Resolução Assíncrona:** Em `play(track)`, a chamada `audioResolverService.resolveTrackAudio(track)` é assíncrona. Se o usuário clicar rapidamente na Música A e logo em seguida na Música B, a promise da Música A pode resolver depois da Música B, sobrepondo o áudio da Música B.  
  *Correção Necessária:* Adicionar um token de cancelamento ou chave de transação (`activeTrackIdRef`) para descartar resoluções obsoletas.

---

## 4. State Management Audit

O gerenciamento de estado atual está dividido da seguinte forma:

1. **`PlayerContext` (`src/stores/playerContext.tsx`):**
   - React Context padrão usando hooks `useState`.
   - Gerencia: `currentTrack`, `playbackState`, `currentTime`, `duration`, `volume`, `isMuted`, `isShuffle`, `repeatMode`, `queue`, `queueIndex`, `likedTrackIds`.
   - *Diagnóstico:* Monolítico. Mistura dados de baixíssima frequência de alteração (como `likedTrackIds` ou `repeatMode`) com dados de altíssima frequência (`currentTime` a cada 100ms).
2. **`PlaylistContext` (`src/stores/playlistStore.tsx`):**
   - React Context que gerencia as playlists customizadas e o estado dos modais globais (`activeModal`, `pendingTrackForPlaylist`).
   - Persistência em `localStorage` via `STORAGE_KEY = 'moosic_custom_playlists_v1'`.
   - *Diagnóstico:* Bem isolado e estável. Suporta adequadamente o acoplamento do novo subsistema de Playlist DNA.
3. **`playerStore.ts` & `themeStore.ts`:**
   - Interfaces e valores padrão órfãos. Não contêm stores reais Zustand/Redux.

---

## 5. Performance Audit (Auditoria Crítica de Desempenho)

### 5.1. O Gargalo de Re-renderização por `currentTime`
O React Context dispara renderização em **todos** os componentes que invocam `usePlayer()` sempre que o valor do contexto muda. Como `currentTime` é atualizado a cada 100ms:

```text
youtubeAudioEngine (tick 100ms)
       ↓
onTimeUpdate(cur, dur)
       ↓
setCurrentTime(cur)  <-- DISPARA A CADA 100ms (10 vezes por segundo)
       ↓
PlayerContext.Provider value={...} atualizado
       ↓
RE-RENDERIZAÇÃO COMPLETA DE:
  • AppLayout (por causa de currentTrack?.accent)
  • HomePage (4 carrosséis com ~30 cards de música)
  • SearchPage (8 estações de gênero + resultados)
  • LibraryPage
  • PlaylistView
  • PersistentBottomPlayer
```

### 5.2. O Loop de Limpeza do Intervalo no Player
No arquivo `PersistentBottomPlayer.tsx` (linhas 79-92):
```typescript
useEffect(() => {
  if (!isPlaying) return;
  const interval = setInterval(() => {
    setWaveHeights(...);
  }, 100);
  return () => clearInterval(interval);
}, [isPlaying, currentTime]); // <-- Depende de currentTime!
```
Como `currentTime` muda 10 vezes por segundo, o `setInterval` é destruído e recriado 10 vezes por segundo, gerando desperdício inútil de timers no event loop do navegador.

### 5.3. Estratégia Obrigatória de Otimização:
1. **Desacoplar o tempo do contexto:** Separar `usePlayer()` (dados de controle e metadados) de `usePlayerProgress()` (tempo e progresso) ou migrar o playback de áudio para Zustand com seletores finos (`usePlayerStore(s => s.currentTrack)` vs `usePlayerStore(s => s.currentTime)`).
2. O scrubber do player inferior deve ler o progresso através de uma referência direta ou componente isolado que não force re-render dos botões de controle e da tela inteira.

---

## 6. Data Model Audit (Tipos Existentes vs. Tipos Necessários)

### 6.1. O que já existe em `src/types/domain/`:
* `Track`: Bem modelado (`id`, `title`, `artistId`, `artistName`, `albumTitle`, `coverUrl`, `durationSeconds`, `audioUrl`, `genre`, `accent`, `isExplicit`, `providerId`, `providerTrackId`).
* `Artist`: Básico (`id`, `name`, `avatarUrl`, `genres`).
* `Album`: Básico (`id`, `title`, `artistId`, `artistName`, `coverUrl`).
* `CustomPlaylist`: Básico (`id`, `title`, `description`, `themeId`, `tracks`, `createdAt`).

### 6.2. O que NÃO existe e precisa ser criado:
Para viabilizar a nova visão de produto, os seguintes modelos precisam ser formalizados:

1. **`AudioMetrics`:** Medidores acústicos que alimentam o DNA da playlist e as recomendações.
2. **`ListeningEvent`:** Registro atômico de cada interação de reprodução (play, pause, skip, conclusão).
3. **`ListeningSession`:** Agregação de eventos delimitada por janelas temporais de inatividade.
4. **`SessionStory`:** Narrativa editorial derivada da sessão (*Intro → Build → Peak → Wind Down*).
5. **`PlaylistDNA`:** Assinatura acústica consolidada de uma lista de faixas.
6. **`TasteProfile` (Music DNA):** Arquétipo de comportamento sonoro do ouvinte.
7. **`SmartQueueItem`:** Item da fila com indicador de origem (*Manual vs. Sugestão*) e justificativa.

Abaixo está o mapeamento detalhado das entidades necessárias:

| Entidade | Responsabilidade | Relacionamentos | Dados Obrigatórios | Dados Opcionais | Ciclo de Vida |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`AudioMetrics`** | Métricas acústicas da faixa | Pertence a 1 `Track` | `energy`, `danceability`, `atmosphere`, `moodValence`, `tempoBpm` | `acousticness`, `vocalsRatio`, `key` | Persistido no cache da faixa |
| **`ListeningEvent`** | Registra interação de escuta | 1 `User`, 1 `Track`, 1 `Session` | `id`, `trackId`, `timestamp`, `durationPlayed`, `skipped` | `skipOffset`, `sourceContext`, `contextId` | Gravado em lote (LocalStorage/IndexedDB) |
| **`ListeningSession`** | Consolidação temporal de uma sessão | Agrega múltiplos `ListeningEvents` | `id`, `startedAt`, `endedAt`, `trackCount`, `averageEnergy` | `peakEnergyTime`, `dominantGenres`, `narrative` | Calculado ao encerrar a sessão |
| **`PlaylistDNA`** | Impressão digital acústica da lista | Pertence a 1 `Playlist` | `playlistId`, `energy`, `danceability`, `atmosphere`, `tempoAvg` | `artistDiversity`, `genreDiversity`, `isMocked` | Calculado sempre que faixas mudam |
| **`TasteProfile`** | Arquétipo musical do usuário | Pertence a 1 `User` | `archetypeTitle`, `traits`, `topGenres` | `archetypeDescription`, `evolutionHistory` | Recalculado periodicamente |
| **`SmartQueueItem`** | Item estruturado da fila de escuta | Contém 1 `Track` | `id`, `track`, `origin` ('manual' \| 'smart') | `recommendationReason`, `confidenceScore` | Transitório (memória da sessão) |

---

## 7. Provider Architecture Audit

O MooSic atual possui contratos bem definidos em `src/providers/`, mas com lacunas evidentes:

* **`IMusicProvider` (`src/providers/music/`):**  
  🟢 **Excelente.** Possui implementações completas:
  - `deezerMusicProvider.ts` (API real Deezer com proxy CORS).
  - `iTunesMusicProvider.ts` (API real iTunes).
  - `musicBrainzProvider.ts` (API aberta MusicBrainz).
  - `mockMusicProvider.ts` (Fallback offline resiliente).
* **`ILyricsProvider` (`src/providers/lyrics/`):**  
  🟢 **Excelente.** Interface concisa com implementação real `lrclibLyricsProvider.ts` (LRCLIB API aberta com sincronização de letras LRC).
* **`IAudioProvider` (`src/providers/audio/`):**  
  🟠 **Incompleto.** A interface `IAudioProvider.ts` existe, mas o player contorna essa interface e fala diretamente com `youtubeAudioEngine.ts` e `audioResolverService.ts`.
* **`IMetadataProvider` (`src/providers/metadata/`):**  
  🟡 **Parcial.** Interface existe, mas não é utilizada para enriquecer faixas com métricas acústicas.
* **Provedores Faltantes Obrigatórios:**
  - `IRecommendationProvider`: Para gerar a Smart Queue e a Discovery Roulette.
  - `IAnalyticsProvider`: Para processar os eventos de escuta e calcular sessões.

---

## 8. Listening Event Architecture (Arquitetura de Eventos)

Para evitar sobrecarregar o storage do navegador, **nem todo evento deve ser gravado de forma síncrona no disco**.

### Eventos Transitórios vs. Persistentes:

```text
[AÇÕES DO USUÁRIO]
  │
  ├──► Play / Resume   ──► Transitório (inicia cronômetro do evento na memória)
  ├──► Volume / Scrubber──► Transitório (apenas atualiza o estado de reprodução)
  │
  ├──► Skip (< 25s)    ──► PERSISTENTE: Registra rejeição e offset do skip
  ├──► Track Completed ──► PERSISTENTE: Registra afinidade máxima (playedRatio > 0.85)
  ├──► Add to Playlist ──► PERSISTENTE: Registra sinal forte de preferência
  └──► Like / Unlike   ──► PERSISTENTE: Registra marcação explícita de gosto
```

### Mecanismo de Coleta Não-Intrusivo:
1. Um listener leve no store de playback despacha eventos para um buffer em memória (`eventBuffer: ListeningEvent[]`).
2. Quando a faixa termina ou é pulada, o evento é formalizado e armazenado em lote no `localStorage` sob a chave `moosic_listening_events_v1`.
3. Nenhum evento bloqueia o thread de renderização da interface.

---

## 9. Listening Session Architecture (Arquitetura de Sessões)

O ciclo de vida da sessão deve funcionar como uma máquina de estados temporal:

```text
               Nenhum áudio tocando por > X minutos
            ┌─────────────────────────────────────────┐
            │                                         ▼
   [SESSÃO INATIVA] ──(Primeiro Play)──► [SESSÃO ATIVA]
            ▲                                 │
            │                         (Pausa / Parada)
            │                                 │
            │                                 ▼
            └────(Timeout de Inatividade)── [PAUSA TEMPORÁRIA]
                     (padrão: 15 min,                 │
                      configurável)           (Resume < 15 min)
                                                      │
                                                      ▼
                                                [SESSÃO ATIVA]
```

### Regras de Negócio da Sessão:
1. **Início:** Disparado no primeiro `play` após uma inatividade superior ao limiar.
2. **Limiar de Continuidade (Configurável):** O padrão é de **15 minutos**. Se o usuário pausar e voltar em 8 minutos, a sessão continua. Se voltar 20 minutos depois, a sessão anterior é fechada e sumarizada, e uma nova sessão se inicia.
3. **Fechamento Antecipado:** O evento de fechamento da aba/navegador (`beforeunload`) consolida a sessão ativa imediatamente.
4. **Síntese de Narrativa ("Sua sessão teve uma história"):**  
   Ao fechar a sessão com $\ge 3$ faixas:
   - Identifica a faixa inicial como **Intro**.
   - Calcula os momentos de ascensão de energia como **Build**.
   - O ponto de maior energia como **Peak**.
   - A desaceleração final como **Wind Down**.

---

## 10. Playlist DNA Architecture

O Playlist DNA transforma listas de faixas estáticas em um perfil auditivo mensurável.

### Estratégia Híbrida de Dados (Mock Coerente + Futuro Provedor Real):
Atualmente, as APIs abertas (Deezer/iTunes) não fornecem vetores de áudio detalhados como a API do Spotify Web Audio Features.  
**Solução Arquitetural:**
1. Criar um serviço abstrato `playlistDnaService.ts`.
2. Para cada faixa, o serviço infere ou gera métricas determinísticas e reproduzíveis baseadas em:
   - **Gênero musical** da faixa (ex: Trap = alta energia + dançabilidade; Lo-Fi = alta atmosfera + baixa energia).
   - **BPM e Duração** da faixa.
   - **Hash determinístico do ID da faixa** (garante que a mesma faixa sempre retorne exatamente os mesmos valores de métrica, sem variações aleatórias).
3. A playlist agrega a média ponderada das faixas:
   $$\text{Playlist Energy} = \frac{1}{N} \sum_{i=1}^{N} \text{Track Energy}_i$$
4. Cada cálculo armazena a flag `isMocked: true`, permitindo que no futuro, caso uma API como AcousticBrainz ou Spotify Features seja plugada, o frontend não sofra nenhuma alteração estrutural.

---

## 11. Smart Queue Architecture

A fila inteligente deve respeitar a soberania da escolha do usuário:

```text
┌─────────────────────────────────────────────────────────────┐
│                       SMART QUEUE                           │
├─────────────────────────────────────────────────────────────┤
│ [FILA MANUAL] (Prioridade Absoluta)                         │
│  1. Racionais MC's - Vida Loka (Pt. 1)                      │
│  2. Sabotage - Um Bom Lugar                                 │
├─────────────────────────────────────────────────────────────┤
│ [MOOSIC FLOW: SUGESTÕES INTELIGENTES] (Transparente)        │
│  ✨ 3 músicas sugeridas para manter a cadência de energia    │
│  3. BK' - Planos                                            │
│     ↳ "Por que? Mantém a energia (78%) e o gênero Rap"      │
│  4. Djonga - Leal                                           │
│     ↳ "Por que? Frequente nas suas sessões noturnas"        │
└─────────────────────────────────────────────────────────────┘
```

### Regras da Fila:
1. **Isolamento de Erros:** Se o motor de recomendação falhar, a fila manual do usuário nunca é alterada nem esvaziada.
2. **Ações Independentes:** O usuário pode aceitar uma faixa sugerida (movendo-a para a fila manual), descartá-la individualmente com swipe/clique ou desativar o fluxo inteligente com um toggle.
3. **Transparência:** Cada faixa gerada pelo algoritmo carrega obrigatoriamente um motivo amigável (*"Por que essa música?"*).

---

## 12. Feature Dependency Graph (Árvore de Dependências)

```text
[P0] REFATORAÇÃO DE ESTADO E PERFORMANCE DO PLAYER
 │   (Desacoplamento de currentTime e eliminação de re-renders)
 │
 ├──► [P1] SUBSISTEMA DE EVENTOS & HISTÓRICO
 │     ├── ListeningEvent Tracker
 │     └── ListeningHistory Service
 │          │
 │          ▼
 ├──► [P2] SUBSISTEMA DE SESSÕES & DNA
 │     ├── Session Detector & Storage
 │     ├── Session Story Synthesizer ("Sua sessão teve uma história")
 │     └── Playlist DNA Service & Visual Matrix
 │          │
 │          ▼
 ├──► [P3] DESCOBERTA INTELIGENTE
 │     ├── Recommendation Engine & Rules
 │     ├── Smart Queue com justificativas ("Por que essa música?")
 │     └── Discovery Roulette (Familiar → Wild)
 │          │
 │          ▼
 ├──► [P4] CARTOGRAFIA MUSICAL & PERFIL
 │     ├── Taste Profile (Music DNA: The Night Explorer)
 │     ├── Music Journey (Linha do tempo mensal)
 │     └── Your Day in Music (Distribuição horária)
 │          │
 │          ▼
 └──► [P5] EXPERIÊNCIAS AVANÇADAS
       ├── Playlist Flow Architect (Intro → Peak → Outro)
       ├── Mood Mixing (Chill × Night Drive)
       ├── Collaborative Blend
       └── Playlist Cover Studio
```

---

## 13. Technical Debt (Débitos Técnicos Mapeados)

1. **Monolito `PlayerContext`:** Responsável por mais de 15 responsabilidades distintas e propagando re-renders a cada 100ms.
2. **Código Órfão:**
   - `src/hooks/usePlayer.ts` (stub não funcional).
   - `src/hooks/useTheme.ts` (hook sem uso).
   - `src/stores/playerStore.ts` (interface isolada).
   - `src/stores/themeStore.ts` (store sem uso).
   - `src/services/audio/audioService.ts` (serviço não integrado).
3. **Feature Placeholders Vazios:**
   - `src/features/discovery/index.ts`
   - `src/features/artists/index.ts`
   - `src/features/albums/index.ts`
   - `src/features/profile/index.ts`
   - `src/features/settings/index.ts`
4. **Ausência de Camada de Persistência Abstrata:** O código utiliza chamadas diretas a `localStorage.getItem/setItem` espalhadas por múltiplos componentes e stores em vez de uma camada unificada de repositório com tratamento de cota de armazenamento e migrações de schema.

---

## 14. Risks (Riscos Mapeados)

| Risco Técnico | Impacto | Mitigação Arquitetural |
| :--- | :---: | :--- |
| **Estouro de Cota de `localStorage`** ao gravar eventos e sessões | Alto | Utilizar retenção circular (manter apenas as últimas 30 sessões e 500 eventos) ou adotar IndexedDB para eventos brutos. |
| **Degradação de CPU em dispositivos móveis** por múltiplos tickers | Alto | Eliminar tickers duplicados e restringir animações pesadas no mobile quando a tela estiver em segundo plano. |
| **Falsa Percepção de Recomendações Mágicas** | Médio | Sempre deixar explícita a justificativa da recomendação (*"Por que essa música?"*). Se os dados forem estimados, indicar que a base é acústica e heurística. |
| **Bloqueio de Embeds do YouTube** | Médio | Manter sempre o fallback automático para áudio HTML5 nativo como já implementado com sucesso. |

---

## 15. Recommended Architecture (Arquitetura Proposta)

A evolução arquitetural deve adotar uma separação limpa entre **Camada de Áudio de Baixo Nível**, **Camada de Domínio / Inteligência de Sessão** e **Camada de Apresentação**:

```text
┌───────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                 │
│   HomePage  •  SearchPage  •  PlaylistView  •  StatsPage  │
└─────────────┬───────────────────────────────┬─────────────┘
              │                               │
              ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│     STORES VISUAIS        │   │    STORES ANALÍTICOS      │
│  usePlayerState (Raro)    │   │  usePlaylistDNAStore      │
│  usePlayerProgress (100ms)│   │  useListeningSessionStore │
│  usePlaylistStore         │   │  useTasteProfileStore     │
└─────────────┬─────────────┘   └─────────────┬─────────────┘
              │                               │
              ▼                               ▼
┌───────────────────────────────────────────────────────────┐
│              CAMADA DE SERVIÇOS DE DOMÍNIO                │
│ sessionTrackerService • playlistDnaService • queueService │
└─────────────┬───────────────────────────────┬─────────────┘
              │                               │
              ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   AUDIO ENGINE ADAPTER    │   │   DATA PROVIDER ADAPTER   │
│ YouTubeEngine • HTML5Audio│   │ Deezer • iTunes • LRCLIB  │
└───────────────────────────┘   └───────────────────────────┘
```

---

## 16. Implementation Roadmap

### Fase 1: Fundação, Desempenho e Coleta (P0 & P1)
* Refatorar o `PlayerContext` para isolar o tempo de alta frequência (`currentTime`).
* Criar os tipos de domínio em `src/types/domain/session.ts` e `metrics.ts`.
* Implementar o `sessionTrackerService.ts` para registrar eventos e detectar sessões sem impactar o render.

### Fase 2: Sessões com Narrativa e Playlist DNA (P2)
* Implementar o `playlistDnaService.ts` com cálculo heurístico determinístico.
* Adicionar o componente visual `PlaylistDNABar` no cabeçalho de `PlaylistView.tsx`.
* Criar a página de histórico/estatísticas (`/app/stats`) exibindo a história da sessão (*"Sua sessão teve uma história"*).

### Fase 3: Smart Queue e Descoberta Ousada (P3)
* Implementar `smartQueueService.ts` no drawer de fila com justificativas transparentes.
* Implementar o componente `DiscoveryRoulette` na tela de busca `/app/search`.

### Fase 4: Cartografia e Identidade (P4)
* Implementar o sintetizador de `TasteProfile` (Music DNA: *The Night Explorer*).
* Construir a visualização `MusicJourney` (timeline mensal de evolução).

---

## 17. Files That Should Be Created

1. `src/types/domain/session.ts`: Modelos de `ListeningEvent`, `ListeningSession`, `SessionNarrativePhase`.
2. `src/types/domain/metrics.ts`: Modelos de `AudioMetrics`, `PlaylistDNA`, `TasteProfile`.
3. `src/services/session/sessionTrackerService.ts`: Orquestrador de sessões e eventos com persistência em lote.
4. `src/services/playlist/playlistDnaService.ts`: Motor de cálculo acústico do DNA de playlists.
5. `src/services/recommendation/smartQueueService.ts`: Motor de sugestões contextuais para a fila.
6. `src/components/playlist/PlaylistDNABar.tsx`: Medidores visuais de DNA na playlist.
7. `src/features/stats/StatsPage.tsx`: Interface central de Sessões, Histórico e Music DNA.
8. `src/components/discovery/DiscoveryRoulette.tsx`: Seletor de entropia na busca.

---

## 18. Files That Should Be Modified

1. `src/stores/playerContext.tsx`: Otimização para desacoplar `currentTime` e integrar despacho de eventos de escuta.
2. `src/components/player/PersistentBottomPlayer.tsx`: Remoção do loop de re-criação de timer e conexão com a Smart Queue.
3. `src/features/playlists/PlaylistView.tsx`: Integração com o componente `PlaylistDNABar`.
4. `src/features/search/SearchPage.tsx`: Integração da `DiscoveryRoulette`.
5. `src/components/navigation/Sidebar.tsx`: Adição do item de navegação para Estatísticas / Cartografia (`/app/stats`).
6. `src/app/routes/router.tsx`: Registro da rota `/app/stats`.
7. `src/app/layouts/AppLayout.tsx`: Inclusão do roteamento para `StatsPage`.

---

## 19. Files That Should NOT Be Touched

1. `src/services/audio/binauralResonatorService.ts`: O motor Web Audio API de 432Hz/528Hz está perfeito, testado e desacoplado.
2. `src/components/modals/ResonatorModal.tsx`: O modal e o osciloscópio estão funcionais e estáveis.
3. `src/components/lyrics/LyricsPanel.tsx`: A sincronização de letras verso a verso e auto-scroll suave estão estáveis e aprovados pelo usuário.
4. `src/features/landing/*`: Toda a Landing Page e seus 10 componentes devem ser mantidos 100% íntegros.
5. `src/providers/lyrics/lrclibLyricsProvider.ts`: Integração com letras estável.

---

## 20. Recommended Implementation Order & Summary Table

| Sistema / Componente | Estado Atual | Dependências | Prioridade | Ação Recomendada |
| :--- | :---: | :--- | :---: | :--- |
| **Player State & Performance** | 🟠 Precisa refatorar | Nenhuma | **P0** | Isolar `currentTime` do contexto principal para sanar 100% dos re-renders desnecessários. |
| **Domain Types (Session & DNA)** | ⚪ Inexistente | Nenhuma | **P0** | Criar `session.ts` e `metrics.ts` com schemas compatíveis com futuras APIs. |
| **Listening Event Tracker** | ⚪ Inexistente | Player State | **P1** | Implementar `sessionTrackerService.ts` com buffer em memória e persistência circular. |
| **Playlist DNA Engine** | ⚪ Inexistente | Domain Types | **P1** | Implementar `playlistDnaService.ts` determinístico e componente `PlaylistDNABar.tsx`. |
| **Session Story ("Sua Sessão")** | ⚪ Inexistente | Event Tracker | **P2** | Implementar sintetizador de narrativa e tela `/app/stats` (Sessões Recentes). |
| **Smart Queue Transparente** | ⚪ Inexistente | Player State | **P2** | Expandir drawer da fila com sugestões justificadas (*"Por que essa música?"*). |
| **Discovery Roulette** | ⚪ Inexistente | Music Service | **P3** | Adicionar seletor de 4 níveis de entropia na tela de busca (`SearchPage.tsx`). |
| **Taste Profile (Music DNA)** | ⚪ Inexistente | Session Tracker | **P3** | Criar arquétipos comportamentais (*The Night Explorer*) no painel de estatísticas. |
| **Limpeza de Código Morto** | 🔴 Inútil | Nenhuma | **P0** | Deletar com segurança `src/hooks/usePlayer.ts`, `useTheme.ts`, `themeStore.ts`. |

---

## 21. P0 Implementation Status

**Status da Implementação:** Concluído com Sucesso  
**Data:** 05 de Setembro de 2026

Nesta etapa (P0 + Fundação da Arquitetura de Produto), todas as prioridades críticas identificadas na auditoria foram resolvidas no código real sem regressões visuais ou quebra de contratos.

### 21.1. O que foi corrigido e implementado

1. **Desacoplamento de `currentTime` (Fim dos Re-renders Globais):**
   - **Solução:** Implementado o store seletivo `playerProgressStore` utilizando `useSyncExternalStore` nativo do React 18.
   - **Mecanismo:** O loop de alta frequência do motor de áudio (10x/segundo) despacha atualizações via `playerProgressStore.setProgress(cur, dur)`. Somente componentes que assinam explicitamente `usePlayerProgress()` recebem a re-renderização de 100ms (barra de scrubber do PersistentBottomPlayer e linhas do LyricsPanel).
   - **Garantia:** Páginas completas como `HomePage`, `SearchPage`, `PlaylistView`, `LibraryPage`, cards de música e `AppLayout` não sofrem nenhuma re-renderização por conta do avanço temporal de áudio.

2. **Estabilização do Visualizador no `PersistentBottomPlayer`:**
   - **Solução:** O loop de atualização de barras de espectro foi completamente desacoplado de `[isPlaying, currentTime]`. O timer de animação agora roda com ciclo próprio dependente estritamente de `isPlaying`, eliminando a contínua destruição/recriação de intervalos (10x/s).

3. **Proteção contra Race Condition na Troca Rápida de Faixas:**
   - **Solução:** Introduzido `playTransactionRef` com contador transacional sequencial em `playerContext.tsx`.
   - **Mecanismo:** Ao solicitar a reprodução de faixas em sequência rápida (A → B → C), cada clique incrementa o ID da transação. Quando a resolução assíncrona de metadados/áudio (`audioResolverService.resolveTrackAudio`) retorna, ela checa se o token transacional ainda é o atual (`transactionId === playTransactionRef.current`). Resoluções defasadas de A ou B são imediatamente descartadas, garantindo que apenas a faixa mais recente (C) assuma o player.

4. **Integração Completa do `PlaybackContext`:**
   - **Solução:** O tipo `PlaybackContext` foi enriquecido para contemplar `type` (`home`, `search`, `playlist`, `library`, `album`, `artist`, `discovery`, `recommendation`, `queue`, `flow`, `favorites`), `id`, `title` e `position`.
   - **Propagação Real:** Todas as origens de disparo de reprodução (`HomePage`, `SearchPage`, `PlaylistView`, `LibraryPage`) agora enviam o contexto correto para `play(track, context)` e `setQueue(tracks, startIndex, context)`.

5. **Infraestrutura de Domínio e `ListeningEventTracker`:**
   - **Solução:** Criado `src/types/domain/event.ts` e o serviço singleton `src/services/session/listeningEventTracker.ts`.
   - **Heurísticas Ativas:**
     - **Skip:** Registrado quando uma faixa é abandonada com menos de 25 segundos (`durationPlayed < 25`).
     - **Complete:** Registrado quando a reprodução supera 85% da duração (`completionRatio >= 0.85`).
     - **Discretos:** `track_start`, `track_pause`, `track_resume`, `track_like`, `track_add_playlist`.
   - **Persistência Local:** Armazenamento em anel no `localStorage` sob a chave `moosic_listening_events_v1` (limite circular de 200 eventos mais recentes), sem poluir com ticks contínuos de tempo.

6. **Limpeza Segura de Código Morto:**
   - Os arquivos órfãos `src/hooks/usePlayer.ts`, `src/hooks/useTheme.ts`, `src/stores/playerStore.ts` e `src/stores/themeStore.ts` foram verificados contra todo o codebase, confirmados como sem consumidores, e removidos.

### 21.2. Inventário de Arquivos Modificados / Criados / Removidos

- **Novos Arquivos:**
  - `src/stores/playerProgressStore.ts`: Store isolado para tempo decorrido, duração e porcentagem de progresso via `useSyncExternalStore`.
  - `src/types/domain/event.ts`: Definições tipadas para `ListeningEvent`, `ListeningEventType` e seus metadados.
  - `src/services/session/listeningEventTracker.ts`: Serviço de rastreamento comportamental de escuta e persistência local.
- **Arquivos Modificados:**
  - `src/types/domain/player.ts`: Ampliação da tipagem de `PlaybackContext`.
  - `src/types/index.ts`: Exportações dos novos tipos de domínio.
  - `src/stores/playerContext.tsx`: Remoção de `currentTime` do estado React tradicional, guarda de race conditions `playTransactionRef`, injeção do `PlaybackContext` e integração com `listeningEventTracker`.
  - `src/components/player/PersistentBottomPlayer.tsx`: Desacoplamento do scrubber com `usePlayerProgress()` e desacoplamento do visualizador de áudio.
  - `src/components/lyrics/LyricsPanel.tsx`: Adoção de `usePlayerProgress()` para sincronização de versos com precisão e sem dependência do contexto global.
  - `src/features/home/HomePage.tsx`: Envio de `PlaybackContext` em cliques da Spotlight e carrosséis.
  - `src/features/search/SearchPage.tsx`: Envio de `PlaybackContext` nos resultados de busca e nas estações de gênero.
  - `src/features/playlists/PlaylistView.tsx`: Envio de `PlaybackContext` nos cliques da playlist customizada.
  - `src/features/library/LibraryPage.tsx`: Envio de `PlaybackContext` na reprodução de músicas curtidas.
- **Arquivos Removidos (Código Morto Confirmado):**
  - `src/hooks/usePlayer.ts`
  - `src/hooks/useTheme.ts`
  - `src/stores/playerStore.ts`
  - `src/stores/themeStore.ts`

### 21.3. Resultados das Validações

- **Typecheck (`tsc --noEmit`):** 0 erros.
- **Build (`npm run build`):** Sucesso absoluto (`dist/assets/index-CKknqFD5.js`, built in 14.32s).
- **Validação E2E no Navegador:**
  - Reprodução contínua e scrubber funcional.
  - Troca rápida A → B → C testada sem bugs nem retorno para faixas intermediárias.
  - Sincronização e rolagem das letras funcionando em tempo real.
  - Eventos de escuta (`track_start`, `track_pause`, `track_skip`, `track_complete`) registrados com sucesso no `localStorage` com suas origens de contexto.

---

## 22. P1 Implementation Status — Listening History & Listening Sessions

**Status da Implementação:** Concluído com Sucesso  
**Data:** 05 de Setembro de 2026  
**Referência:** `MOOSIC_PRODUCT_SPEC.md` (Pilar B: Session Intelligence & Taxonomia de Sessões)

### 22.1. O que foi construído

1. **Modelagem de Domínio (`src/types/domain/session.ts`):**
   - Criados os contratos tipados:
     - `ListeningSession`: modelo de sessão agregada contendo contadores de faixas, timestamps, retenção, lista de faixas e `SessionStory`.
     - `SessionStory`: sintetizador editorial com `title`, `narrative`, `insight`, `dominantVibe` e fases (`SessionNarrativePhase`).
     - `HistoryItem`: histórico pontual cronológico com referência a faixa, contexto de reprodução e status de término (completa ou skip).

2. **Serviço de Agregação de Sessões (`src/services/session/sessionService.ts`):**
   - Assina os eventos do `listeningEventTracker` e agrupa reproduções contínuas em uma sessão ativa.
   - **Regra de Inatividade:** Inatividade > 20 minutos consolida e fecha a sessão anterior automaticamente, gerando uma nova sessão no próximo play.
   - **Sintetizador de Histórias:** Analisa horário (Madrugada, Manhã, Tarde, Crepúsculo, Noite), taxa de skips vs conclusões, cadência e diversidade de artistas para produzir insights poéticos e explicáveis.
   - **Persistência Local Circular:** `moosic_listening_sessions_v1`, `moosic_active_session_v1` e `moosic_listening_history_v1`.

3. **Integração na Interface:**
   - **Home Editorial (`HomePage.tsx` + `LastSessionRecap.tsx`):** Exibição do card editorial *"Sua Última Sessão"* logo abaixo do Spotlight Billboard com fases sonoras e botão *"Reouvir Esta Sessão"*.
   - **Biblioteca Aprimorada (`LibraryPage.tsx`):** Navegação por abas com **"Curtidas"**, **"Histórico de Escuta"** (com tags de contexto e status de skip/conclusão) e **"Sessões Gravadas"** (com histórias e botão de tocar a sequência).

### 22.2. Validação
- Compilação TypeScript: `0 erros`.
- Build de Produção Vite: `dist/assets/index-Ut_bNymo.js` gerado em 14.62s.
- Verificação visual e comportamental no navegador: 100% aprovada com screenshots gravados.

---

## 23. P1 Implementation Status — Playlist DNA Engine & Visualizer

**Status da Implementação:** Concluído com Sucesso  
**Data:** 05 de Setembro de 2026  
**Referência:** `MOOSIC_PRODUCT_SPEC.md` (Pilar C: Playlist Engineering & Playlist DNA)

### 23.1. O que foi construído

1. **Modelagem de Domínio (`src/types/domain/playlist.ts`):**
   - Introduzidos os contratos tipados:
     - `AudioMetrics`: métricas espectrais e psicoacústicas (`energy`, `danceability`, `atmosphere`, `acousticness`, `instrumentalness`, `valenceMood`, `tempoBpm`).
     - `PlaylistDNA`: identidade mensurável da playlist contendo título e descrição de arquétipo sonoro, médias de energia, atmosfera, dançabilidade, presença vocal, BPM médio e diversidade de artistas/gêneros.

2. **Motor Determinístico de DNA (`src/services/playlist/playlistDnaService.ts`):**
   - `analyzeTrack(track)`: extração determinística de métricas sonoras correlacionando palavras-chave de gênero, título e sementes determinísticas baseadas no ID da faixa.
   - `computePlaylistDNA(playlistId, tracks)`: sintetizador analítico que pondera médias, calcula diversidade de artistas únicos e infere o arquétipo da coleção (*⚡ Pulso Eletrizante & Beat Urbano*, *🎻 Santuário Acústico & Intimista*, *🌌 Imersão Atmosférica Noturna*, etc.).

3. **Visualizador de DNA (`src/components/playlist/PlaylistDNABar.tsx`):**
   - Componente visual dark glassmorphism integrado na tela de visualização de playlist (`PlaylistView.tsx`).
   - Apresenta 4 medidores analíticos com gradientes refinados (Energia, Atmosfera, Dançabilidade e Presença Vocal), badges de BPM médio e contagem de artistas únicos.

### 23.2. Validação
- Compilação TypeScript: `0 erros`.
- Build de Produção Vite: `dist/assets/index-BzqhxmCB.js` gerado em 17.53s.
- Verificação visual no navegador real em `/app/playlist/:id`: renderização responsiva, layout harmonioso e métricas dinâmicas aprovadas com captura de tela.




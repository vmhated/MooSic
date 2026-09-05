# MooSic - Visão Geral do Projeto e Funcionalidades Desenvolvidas 🎵🚀

Este documento resume detalhadamente todas as funcionalidades, arquitetura, design e inovações implementadas até o momento no **MooSic**, cobrindo a **Landing Page (Vitrine de Marca)**, a **Aplicação Player**, as **Tecnologias de Áudio**, **Playlists** e os **Diferenciais Exclusivos**.

---

## 1. Landing Page (Vitrine e Identidade de Marca)

A landing page foi desenvolvida para oferecer uma experiência cinematográfica e sensorial que introduz a proposta de valor do MooSic antes da entrada no player:

* **Hero Cinemático de Entrada ([BrandRevealHero.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/BrandRevealHero.tsx))**:
  * Apresentação com tipografia imersiva e atmosfera escura profunda (`#07080B`).
  * Iluminação ambiente dinâmica em tons de violeta, magenta e neon.
  * Chamada de ação direta para o player (`/app`).
* **Identidade do Infinito e Sound Design ([BrandIntro.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/BrandIntro.tsx) & [LivingInfinity.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/LivingInfinity.tsx))**:
  * Símbolo procedural do Infinito MooSic animado em SVG dinâmico com efeito de dissolução contínua.
  * Micro-interações com áudio sintetizado em tempo real gerado proceduralmente ([brandSoundDesign.ts](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/utils/audio/brandSoundDesign.ts)).
* **Carrossel Tridimensional de Obras de Arte ([ArtworkCarousel.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/ArtworkCarousel.tsx))**:
  * Galeria com profundidade e perspectiva 3D rotativa exibindo capas de álbuns lendários da música nacional e internacional.
* **Demonstração Interativa do Player na Vitrine ([PlayerPreviewSection.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/PlayerPreviewSection.tsx))**:
  * Simulação interativa do player funcional direto na landing page, permitindo que o usuário teste a reprodução e controle o áudio antes de entrar no app.
* **Vitrine de Letras Sincronizadas ([StoryLyrics.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/StoryLyrics.tsx))**:
  * Apresentação do recurso de letras dinâmicas com iluminação ambiente e destaque verso a verso.
* **Atmosfera Sonora e CTA Final ([DynamicAtmosphereSection.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/DynamicAtmosphereSection.tsx) & [FinalCTASection.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/landing/components/FinalCTASection.tsx))**:
  * Demonstração de visualização do espectro sonoro e convite final para iniciar a sessão na plataforma.

---

## 2. Página Inicial do Player (Padrão Spotify + MooSic)

A tela principal do player (`/app`) foi reformulada para eliminar blocos pesados e verticais, adotando um layout fluido e proporcional inspirado nos melhores padrões da indústria:

* **Spotlight Billboard Cinemático**:
  * Banner amplo de destaque no topo com efeito de *blur* dinâmico gerado da capa do álbum.
  * Metadados completos: Título, Artista, Álbum, Duração e selo de qualidade *Master Hi-Res (24b / 96kHz)*.
  * Ações diretas: **Tocar Agora**, **+ Adicionar à Playlist** e **Curtir**.
  * Controles de alternância (`<` e `>`) com contador (`1 / 6`) para navegar entre os destaques editoriais.
* **Carrosséis Horizontais de Músicas (Spotify-Style)**:
  * **Cards Proporcionais e Elegantes**: Formato quadrado com cantos arredondados (`rounded-2xl`, `aspect-square`), permitindo alta densidade de faixas sem sobrecarregar a visão.
  * **Interações no Hover**:
    * Botão circular central de **Play** com elevação suave.
    * Botões de ação rápida no topo direito da capa: **`+ Playlist`** (abre modal para salvar com 1 clique) e **`Curtir`**.
    * Badge luminoso **`OUVINDO`** com ondas animadas no card da música que estiver tocando.
  * **Navegação com Chevrons**: Botões `<` e `>` nos cabeçalhos de cada seção temática para rolar horizontalmente com facilidade.
  * **Curadorias Editoriais**:
    * *Lançamentos & Destaques da Semana*
    * *Pop & Sucessos Globais*
    * *Trap & Rimas Urbanas*
    * *Sessão Lo-Fi & Foco Cósmico*

---

## 3. Player Persistente Inferior & Sincronia de Letras

* **Player Inferior Persistente ([PersistentBottomPlayer.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/components/player/PersistentBottomPlayer.tsx))**:
  * Barra de áudio contínua e flutuante que acompanha o usuário em qualquer rota sem pausar a música.
  * Controles completos de reprodução (*Play/Pause, Próxima, Anterior, Loop, Shuffle*).
  * Barra de progresso com seek interativo e indicação de tempo decorrido / total.
  * Controle de volume deslizante.
  * Alternador de **Áudio 3D Espacial** com simulação biquad em tempo real.
  * Acesso em 1 clique ao painel de letras e à fila de reprodução.
* **Painel de Letras Sincronizadas ([LyricsPanel.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/components/player/LyricsPanel.tsx))**:
  * **Visualizador Centralizado**: Capa do álbum, artista e título posicionados de forma equilibrada no centro do bloco com animações.
  * **Auto-Scroll Inteligente**: Algoritmo que calcula o deslocamento do verso atual mantendo-o suavemente no foco da tela sem saltos bruscos.
  * **Seek Interativo por Verso**: Clicar em qualquer verso da letra move a reprodução imediatamente para o timestamp correspondente.
  * **Tratamento Elegante de Ausência de Letras**: Exibição da mensagem temática *"Ainda não sabemos cantar essa"* quando a música não possui letra cadastrada.

---

## 4. Busca Global em Tempo Real & Catálogo Mundial

* **Mecanismo de Busca ([SearchPage.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/search/SearchPage.tsx) & [musicSearchService.ts](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/services/music/musicSearchService.ts))**:
  * Integração com catálogo aberto de milhões de faixas reais (Deezer API com fallback para iTunes Search API e proxy CORS resiliente).
  * Pesquisa instantânea de qualquer artista ou música nacional e internacional (*Matuê, Racionais MC's, BK', Daft Punk, Dua Lipa, The Weeknd, etc.*).
  * Retorno com capas originais em alta definição, metadados fidedignos e prévias de áudio prontas para tocar.
* **Hub de Gêneros Interativo**:
  * Grid de cartões de estilos musicais (*Rap, Pop, Rock, Lo-Fi, R&B, Eletrônica, etc.*).
  * Ao clicar em qualquer gênero, o sistema gera dinamicamente uma playlist temática com faixas reais prontas para execução imediata.

---

## 5. Criação e Gestão de Playlists Personalizadas

* **Sistema de Playlists ([playlistStore.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/stores/playlistStore.tsx) & [PlaylistView.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/features/playlists/PlaylistView.tsx))**:
  * Criação de playlists ilimitadas com título, descrição e seleção de temas visuais exclusivos:
    * *Neon Violet*
    * *Sunset Gold*
    * *Cyberpunk Pink*
    * *Emerald Flow*
    * *Ocean Deep*
    * *Midnight Onyx*
  * **Modais Dedicados**:
    * [CreatePlaylistModal.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/components/modals/CreatePlaylistModal.tsx): Criação ágil com prévia visual do tema.
    * [AddToPlaylistModal.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/components/modals/AddToPlaylistModal.tsx): Adição de qualquer faixa do catálogo com 1 clique a partir dos cards e do spotlight.
  * **Persistência Local**: Armazenamento automático no `localStorage` do navegador para manter as playlists salvas entre sessões.
  * **Interface no Estilo Spotify**: Cabeçalho hero com gradiente temático, estatísticas (quantidade de faixas, duração estimada), botão de reprodução em massa e tabela completa de faixas com ordenação e opção de remoção.

---

## 6. Inovações Sonoras Exclusivas

* **MooSic Resonator ([binauralResonatorService.ts](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/services/audio/binauralResonatorService.ts))**:
  * Síntese de frequências harmônicas em tempo real através da **Web Audio API** do navegador.
  * Frequências terapêuticas e mentais disponíveis:
    * **432 Hz**: Sintonia de harmonia universal e alívio do estresse.
    * **528 Hz**: Frequência do milagre e regeneração.
    * **Ondas Alpha (10 Hz)**: Estimulação de foco cognitivo e clareza mental.
    * **Brown Noise (Ruído Marrom)**: Relaxamento profundo e supressão de ruídos externos.
  * **Camada Sonora Independente**: Pode tocar simultaneamente com qualquer música reproduzida no app ou em modo solo, com controle de volume próprio.
* **Modal Interativo com Osciloscópio ([ResonatorModal.tsx](file:///c:/Users/vctrz/OneDrive/Documentos/vm/vmprojetos/MooSic/src/components/modals/ResonatorModal.tsx))**:
  * Visualizador osciloscópico renderizado via Canvas 2D exibindo em tempo real a forma da onda sonora sendo sintetizada.
* **Atalho Rápido na Barra Superior**:
  * Botão **"Sintonia 432Hz"** no topo com indicador de pulso luminoso para ativar ou desativar o sintetizador instantaneamente.
* **Áudio 3D Espacial**:
  * Filtro estéreo espacial integrado que expande a largura do campo sonoro em fones de ouvido.

---

## 7. Arquitetura Técnica & Stack Tecnológico

| Camada | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Interface & Core** | React 19 + TypeScript + Vite | Desempenho ultrarrápido, tipagem estrita e Hot Module Replacement instantâneo |
| **Estilização** | Tailwind CSS + Vanilla CSS Tokens | Design system exclusivo com tema escuro profundo (`#07080B`), neon glow e glassmorphism |
| **Roteamento** | React Router (HashRouter) | Separação desacoplada entre a Landing Page (`/`) e o Player (`/app`) |
| **Gerenciamento de Estado** | Zustand + React Context | Estado desacoplado para reprodução contínua, playlists customizadas e ressonador binaural |
| **Motor de Áudio** | HTML5 Audio + Web Audio API | Síntese de osciladores em tempo real, nós de ganho independentes e filtros de áudio 3D |
| **Catálogo & Metadados** | Deezer API + iTunes API | Cobertura global de busca, capas em alta definição e prévias de streaming |

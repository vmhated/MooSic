# Registro de Decisões Arquiteturais (ADRs) 📝

Este diretório armazena os registros de decisões significativas tomadas durante o projeto MooSic.

---

## ADR-001: Adoção da Arquitetura Orientada a Providers (Inversão de Dependência)

* **Status**: Aprovado
* **Data**: 2026-08-29

### Contexto
 O MooSic será uma plataforma de música que precisará consumir metadados, streaming de áudio e letras de fontes externas que podem mudar ao longo do tempo (ex: MusicBrainz, Jamendo, APIs próprias ou serviços de sincronização).

### Decisão
 Adotamos o padrão de **Provider Interfaces** no diretório `src/providers/`. A aplicação e a UI interagem exclusivamente com abstrações (`IMusicProvider`, `IAudioProvider`, `ILyricsProvider`, `IMetadataProvider`).

### Consequências
* **Positivas**: Permite trocar ou adicionar provedores sem alterar um único componente visual ou tela da aplicação. Facilita testes unitários utilizando mocks.
* **Negativas**: Exige a criação de adaptadores para mapear as respostas de cada API externa para as entidades do domínio MooSic.

---

## ADR-002: Separação de Identidade Institucional vs Cores Dinâmicas por Música

* **Status**: Aprovado
* **Data**: 2026-08-29

### Contexto
 A marca MooSic possui uma identidade visual própria baseada em tons de roxo (`#7C3AED`) e modo escuro, porém a interface deverá se adaptar às cores da capa do álbum/faixa em reprodução.

### Decisão
 Isolamos os Design Tokens em `src/styles/tokens/colors.ts`. As cores da marca permanecem estáticas como `brandColors`, enquanto a paleta adaptativa é injetada dinamicamente no DOM através de variáveis CSS (`--dynamic-vibrant`, `--dynamic-muted`, etc.), evitando sobrescrever o tema padrão do aplicativo.

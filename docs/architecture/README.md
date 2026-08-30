# Arquitetura do MooSic 🏗️

Este documento descreve a organização de camadas, a responsabilidade de cada diretório e os princípios de design adotados no MooSic.

---

## 1. Organização de Pastas e Responsabilidades

* **`src/app/`**: Configuração de roteamento, layouts mestre (desktop/mobile) e providers React Context de nível de aplicação.
* **`src/components/`**: Componentes puramente visuais. Divididos por contexto (`ui`, `navigation`, `player`, `music`, `lyrics`, `playlists`, `common`). **Não contêm lógica de chamada HTTP nem acoplamento direto a APIs.**
* **`src/features/`**: Módulos funcionais da aplicação (`home`, `search`, `discovery`, `library`, `playlists`, `artists`, `albums`, `lyrics`, `profile`, `settings`). Agrupam componentes específicos e fluxos da funcionalidade.
* **`src/services/`**: Serviços de domínio da aplicação (`MusicService`, `AudioService`, `LyricsService`, `MetadataService`). Responsáveis pela orquestração de regra de negócio sem expor a API de terceiros.
* **`src/providers/`**: Interfaces e contratos de adaptadores externos (`IMusicProvider`, `IAudioProvider`, `ILyricsProvider`, `IMetadataProvider`). Permitem a troca transparente de fontes de dados.
* **`src/types/`**: Interfaces e definições estritas do TypeScript para o domínio (Música, Player, Letras, Usuário).
* **`src/styles/tokens/`**: Fundação do Design System (Cores institucionais MooSic, cores dinâmicas de música, tipografia, espaçamento, sombras, animações).

---

## 2. Regras de Dependência e Fluxo de Dados

1. **A UI não se conecta a APIs de Terceiros**:
   A camada de componentes visuais (`src/components/` e `src/features/`) consome exclusivamente **Hooks** (`src/hooks/`), **Stores** (`src/stores/`) ou **Services** (`src/services/`).

2. **Inversão de Dependência (Provider Pattern)**:
   Nenhum serviço depende de uma biblioteca ou API específica (como MusicBrainz ou Jamendo). Eles consomem apenas contratos de interface definidos em `src/providers/`.

3. **Independência de Plataforma**:
   Componentes universais e hooks de domínio devem ser agnósticos para rodar tanto no navegador quanto em WebView Android.

---

## 3. Como Adicionar um Novo Provedor (Ex: MusicBrainz)

1. Crie uma classe que implemente a interface do provedor em `src/providers/music/MusicBrainzProvider.ts`:
   ```typescript
   import { IMusicProvider } from './IMusicProvider';
   import { Track, SearchResults } from '@/types/domain/music';

   export class MusicBrainzProvider implements IMusicProvider {
     readonly id = 'musicbrainz';
     readonly name = 'MusicBrainz';

     async getTrack(id: string): Promise<Track | null> {
       // Implementação específica da API MusicBrainz
     }
     // ... implementar demais métodos
   }
   ```

2. Registre a nova instância no `MusicService` através de `.setProvider(new MusicBrainzProvider())` ou configurando as variáveis de ambiente.

---

## 4. Como Adicionar uma Nova Feature

1. Crie o diretório em `src/features/<nome-feature>/`.
2. Adicione os componentes específicos da tela e exporte a página principal via `index.ts`.
3. Adicione a rota correspondente em `src/app/routes/`.

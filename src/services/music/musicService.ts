import { IMusicProvider } from '@/providers/music/IMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';

/**
 * Service de Orquestração do Domínio de Música.
 * A aplicação acessa este serviço sem conhecer qual provider está ativo.
 */
export class MusicService {
  private activeProvider: IMusicProvider | null = null;

  constructor(provider?: IMusicProvider) {
    if (provider) {
      this.activeProvider = provider;
    }
  }

  public setProvider(provider: IMusicProvider): void {
    this.activeProvider = provider;
  }

  public async getTrack(id: string): Promise<Track | null> {
    if (!this.activeProvider) throw new Error('MusicProvider não inicializado.');
    return this.activeProvider.getTrack(id);
  }

  public async getAlbum(id: string): Promise<Album | null> {
    if (!this.activeProvider) throw new Error('MusicProvider não inicializado.');
    return this.activeProvider.getAlbum(id);
  }

  public async getArtist(id: string): Promise<Artist | null> {
    if (!this.activeProvider) throw new Error('MusicProvider não inicializado.');
    return this.activeProvider.getArtist(id);
  }

  public async search(query: string): Promise<SearchResults> {
    if (!this.activeProvider) throw new Error('MusicProvider não inicializado.');
    return this.activeProvider.search(query);
  }
}

export const musicService = new MusicService();

import { IMusicProvider } from '@/providers/music/IMusicProvider';
import { musicBrainzProvider } from '@/providers/music/musicBrainzProvider';
import { mockMusicProvider } from '@/providers/music/mockMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { env } from '@/config/env';

/**
 * Service de Orquestração do Domínio de Música.
 * A aplicação acessa este serviço sem conhecer qual provider está ativo.
 */
export class MusicService {
  private activeProvider: IMusicProvider;

  constructor() {
    // Define provider conforme variável de ambiente ou fallback
    if (env.musicProvider === 'mock') {
      this.activeProvider = mockMusicProvider;
    } else {
      this.activeProvider = musicBrainzProvider;
    }
  }

  public setProvider(provider: IMusicProvider): void {
    this.activeProvider = provider;
  }

  public getProvider(): IMusicProvider {
    return this.activeProvider;
  }

  public async getTrack(id: string): Promise<Track | null> {
    return this.activeProvider.getTrack(id);
  }

  public async getAlbum(id: string): Promise<Album | null> {
    return this.activeProvider.getAlbum(id);
  }

  public async getArtist(id: string): Promise<Artist | null> {
    return this.activeProvider.getArtist(id);
  }

  public async search(query: string): Promise<SearchResults> {
    return this.activeProvider.search(query);
  }

  public async getFeaturedTracks(): Promise<Track[]> {
    return this.activeProvider.getFeaturedTracks();
  }
}

export const musicService = new MusicService();

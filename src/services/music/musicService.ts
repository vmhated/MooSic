import { IMusicProvider } from '@/providers/music/IMusicProvider';
import { hybridMusicProvider } from '@/providers/music/hybridMusicProvider';
import { deezerMusicProvider } from '@/providers/music/deezerMusicProvider';
import { iTunesMusicProvider } from '@/providers/music/iTunesMusicProvider';
import { musicBrainzProvider } from '@/providers/music/musicBrainzProvider';
import { mockMusicProvider } from '@/providers/music/mockMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { env } from '@/config/env';

/**
 * Service de Orquestração do Domínio de Música.
 * A aplicação consome este serviço de forma agnóstica ao provedor ativo.
 */
export class MusicService {
  private activeProvider: IMusicProvider;

  constructor() {
    if (env.musicProvider === 'mock') {
      this.activeProvider = mockMusicProvider;
    } else if (env.musicProvider === 'musicbrainz') {
      this.activeProvider = musicBrainzProvider;
    } else if (env.musicProvider === 'itunes') {
      this.activeProvider = iTunesMusicProvider;
    } else if (env.musicProvider === 'deezer') {
      this.activeProvider = deezerMusicProvider;
    } else {
      // Default: Federated Hybrid Engine (Busca paralela simultânea Apple Music + Deezer 100M+ com desduplicação)
      this.activeProvider = hybridMusicProvider;
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

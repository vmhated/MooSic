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

  public async getArtistTopTracks(artistId: string, limit?: number): Promise<Track[]> {
    return this.activeProvider.getArtistTopTracks(artistId, limit);
  }

  public async getChartTracks(countryCode?: string, limit?: number): Promise<Track[]> {
    return this.activeProvider.getChartTracks(countryCode, limit);
  }

  public async getChartArtists(limit?: number): Promise<Artist[]> {
    return this.activeProvider.getChartArtists(limit);
  }

  public async getGenreChart(genreId: string, limit?: number): Promise<Track[]> {
    return this.activeProvider.getGenreChart(genreId, limit);
  }

  public async search(query: string): Promise<SearchResults> {
    return this.activeProvider.search(query);
  }

  public async searchArtists(query: string): Promise<Artist[]> {
    return this.activeProvider.searchArtists(query);
  }

  public async searchAlbums(query: string): Promise<Album[]> {
    return this.activeProvider.searchAlbums(query);
  }

  /**
   * Derives real genres from track search results for an artist.
   * Does NOT use a static genre catalog — all data comes from real provider responses.
   */
  public async getArtistGenres(artistName: string): Promise<string[]> {
    const results = await this.activeProvider.search(artistName);
    const genreFreq: Record<string, number> = {};

    for (const track of results.tracks) {
      const g = track.genre;
      if (g && g.trim() && g !== 'Global Sound') {
        genreFreq[g] = (genreFreq[g] || 0) + 1;
      }
    }

    return Object.entries(genreFreq)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);
  }

  /**
   * Returns real chart artists from Deezer's global trending endpoint.
   * No guessing — these are the actual top artists worldwide right now.
   */
  public async getFeaturedArtists(): Promise<Artist[]> {
    return deezerMusicProvider.getChartArtists(25);
  }

  /**
   * Returns artists editorially related to a given artist.
   * Only works when the artist comes from Deezer (has a deezer providerArtistId).
   * Falls back to empty array for other providers.
   */
  public async getRelatedArtists(artist: { provider: string; providerArtistId: string }): Promise<Artist[]> {
    if (artist.provider !== 'deezer') return [];
    return deezerMusicProvider.getRelatedArtists(artist.providerArtistId);
  }

  public async getFeaturedTracks(): Promise<Track[]> {
    return this.activeProvider.getFeaturedTracks();
  }
}

export const musicService = new MusicService();

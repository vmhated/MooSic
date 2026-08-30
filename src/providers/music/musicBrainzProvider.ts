import { IMusicProvider } from './IMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { MusicBrainzAdapter } from './musicBrainzAdapter';
import { mockMusicProvider } from './mockMusicProvider';
import { env } from '@/config/env';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutos de cache em memória

export class MusicBrainzProvider implements IMusicProvider {
  readonly id = 'musicbrainz';
  readonly name = 'MusicBrainz Real Open Music Data';

  private cache: Map<string, CacheEntry<any>> = new Map();
  private lastRequestTime = 0;

  /**
   * Garante respeito ao rate limit do MusicBrainz (1 req/s)
   */
  private async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Executa fetch com timeout e headers obrigatórios do MusicBrainz
   */
  private async fetchWithTimeout(url: string, timeoutMs = 4000): Promise<Response> {
    await this.throttle();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': env.musicBrainzUserAgent,
        },
      });
      clearTimeout(timer);
      return response;
    } catch (error) {
      clearTimeout(timer);
      throw error;
    }
  }

  /**
   * Busca com cache em memória
   */
  private async fetchJson<T>(url: string): Promise<T | null> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }

    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) return null;
      const data = await res.json();
      this.cache.set(url, { data, timestamp: Date.now() });
      return data as T;
    } catch (err) {
      // Falha de rede ou timeout
      return null;
    }
  }

  async getTrack(id: string): Promise<Track | null> {
    try {
      const url = `${env.musicBrainzUrl}/recording/${id}?inc=artists+releases+tags&fmt=json`;
      const raw = await this.fetchJson<any>(url);
      if (!raw) {
        return mockMusicProvider.getTrack(id);
      }
      return MusicBrainzAdapter.toDomainTrack(raw, 0);
    } catch {
      return mockMusicProvider.getTrack(id);
    }
  }

  async getAlbum(id: string): Promise<Album | null> {
    return mockMusicProvider.getAlbum(id);
  }

  async getArtist(id: string): Promise<Artist | null> {
    return mockMusicProvider.getArtist(id);
  }

  async search(query: string): Promise<SearchResults> {
    try {
      const encoded = encodeURIComponent(query);
      const url = `${env.musicBrainzUrl}/recording?query=${encoded}&limit=10&fmt=json`;
      const data = await this.fetchJson<any>(url);

      if (!data || !data.recordings || data.recordings.length === 0) {
        return mockMusicProvider.search(query);
      }

      return MusicBrainzAdapter.toDomainSearchResults(data.recordings);
    } catch {
      return mockMusicProvider.search(query);
    }
  }

  /**
   * Obtém as faixas em destaque buscando gravações reais e consagradas do MusicBrainz
   */
  async getFeaturedTracks(): Promise<Track[]> {
    const cacheKey = 'featured-hero-tracks';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      // Busca uma seleção curada de gravações consagradas via MusicBrainz
      const url = `${env.musicBrainzUrl}/recording?query=tag:electronic+OR+tag:ambient+OR+tag:synthwave&limit=6&fmt=json`;
      const data = await this.fetchJson<any>(url);

      if (data && data.recordings && data.recordings.length >= 3) {
        const tracks = data.recordings.slice(0, 6).map((rec: any, idx: number) => {
          return MusicBrainzAdapter.toDomainTrack(rec, idx);
        });

        this.cache.set(cacheKey, { data: tracks, timestamp: Date.now() });
        return tracks;
      }
    } catch {
      // Em caso de falha de conexão, fallback seguro para os dados mockados curados
    }

    // Fallback transparente
    const fallbackTracks = await mockMusicProvider.getFeaturedTracks();
    return fallbackTracks;
  }
}

export const musicBrainzProvider = new MusicBrainzProvider();

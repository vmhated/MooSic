import { IMusicProvider } from './IMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { MusicBrainzAdapter } from './musicBrainzAdapter';
import { mockMusicProvider } from './mockMusicProvider';
import { env } from '@/config/env';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutos de cache

export class MusicBrainzProvider implements IMusicProvider {
  readonly id = 'musicbrainz';
  readonly name = 'MusicBrainz Real Open Music Data';

  private cache: Map<string, CacheEntry<any>> = new Map();
  private lastRequestTime = 0;

  /**
   * Respeito ao rate limit (1 req/s)
   */
  private async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < 800) {
      await new Promise((resolve) => setTimeout(resolve, 800 - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  private async fetchWithTimeout(url: string, timeoutMs = 5000): Promise<Response> {
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
    } catch {
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

  /**
   * Busca avançada multi-termo para artistas, bandas e faixas com desduplicação
   */
  async search(query: string): Promise<SearchResults> {
    const clean = query.trim();
    if (!clean) {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }

    try {
      // 1. Busca ampla por gravação / artista
      const searchLucene = `recording:"${clean}" OR artist:"${clean}" OR "${clean}"`;
      const url = `${env.musicBrainzUrl}/recording?query=${encodeURIComponent(searchLucene)}&limit=25&fmt=json`;
      let data = await this.fetchJson<any>(url);

      // 2. Se não encontrou, tenta busca simples direta
      if (!data || !data.recordings || data.recordings.length === 0) {
        const simpleUrl = `${env.musicBrainzUrl}/recording?query=${encodeURIComponent(clean)}&limit=25&fmt=json`;
        data = await this.fetchJson<any>(simpleUrl);
      }

      // 3. Se ainda não encontrou, busca por artista e puxa gravações do artista
      if (!data || !data.recordings || data.recordings.length === 0) {
        const artistUrl = `${env.musicBrainzUrl}/artist?query=${encodeURIComponent(clean)}&limit=1&fmt=json`;
        const artistData = await this.fetchJson<any>(artistUrl);
        const artist = artistData?.artists?.[0];

        if (artist?.id) {
          const artistRecUrl = `${env.musicBrainzUrl}/recording?query=arid:${artist.id}&limit=25&fmt=json`;
          data = await this.fetchJson<any>(artistRecUrl);
        }
      }

      const rawRecordings = data?.recordings || [];
      return MusicBrainzAdapter.toDomainSearchResults(rawRecordings, clean);
    } catch {
      return mockMusicProvider.search(query);
    }
  }

  async getFeaturedTracks(): Promise<Track[]> {
    const cacheKey = 'featured-hero-tracks';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
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
      // Fallback
    }

    return mockMusicProvider.getFeaturedTracks();
  }
}

export const musicBrainzProvider = new MusicBrainzProvider();

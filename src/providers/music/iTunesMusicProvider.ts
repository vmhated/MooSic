import { IMusicProvider } from './IMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { ITunesAdapter } from './iTunesAdapter';
import { mockMusicProvider } from './mockMusicProvider';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 1000 * 60 * 20; // 20 minutos de cache em memória

export class ITunesMusicProvider implements IMusicProvider {
  readonly id = 'itunes';
  readonly name = 'Apple Music / iTunes High-Speed Catalog';

  private cache: Map<string, CacheEntry<any>> = new Map();

  private async fetchJson<T>(url: string, timeoutMs = 4000): Promise<T | null> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) return null;
      const data = await res.json();
      this.cache.set(url, { data, timestamp: Date.now() });
      return data as T;
    } catch {
      clearTimeout(timer);
      return null;
    }
  }

  async getTrack(id: string): Promise<Track | null> {
    try {
      const url = `https://itunes.apple.com/lookup?id=${id}`;
      const data = await this.fetchJson<any>(url);
      if (data && data.results && data.results.length > 0) {
        return ITunesAdapter.toDomainTrack(data.results[0], 0);
      }
      return mockMusicProvider.getTrack(id);
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
   * Busca instantânea sem limites de taxa, retornando músicas, artistas e capas 600x600bb
   */
  async search(query: string): Promise<SearchResults> {
    const clean = query.trim();
    if (!clean) {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }

    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(clean)}&entity=song&limit=40`;
      const data = await this.fetchJson<any>(url, 3000);

      if (data && data.results && data.results.length > 0) {
        return ITunesAdapter.toDomainSearchResults(data.results);
      }

      return { tracks: [], artists: [], albums: [], playlists: [] };
    } catch {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }
  }

  /**
   * Faixas em destaque trazendo os clássicos do catálogo curado (Racionais MC's, Sabotage, BK', Djonga, Criolo, Daft Punk)
   */
  async getFeaturedTracks(): Promise<Track[]> {
    // Retorna as faixas com as identidades visuais de alta fidelidade
    return mockMusicProvider.getFeaturedTracks();
  }
}

export const iTunesMusicProvider = new ITunesMusicProvider();

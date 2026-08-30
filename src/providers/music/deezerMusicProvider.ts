import { IMusicProvider } from './IMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { DeezerAdapter } from './deezerAdapter';
import { mockMusicProvider } from './mockMusicProvider';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 1000 * 60 * 20; // 20 minutos de cache

export class DeezerMusicProvider implements IMusicProvider {
  readonly id = 'deezer';
  readonly name = 'Deezer 100M+ Global & Brazilian Catalog';

  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Executa busca via JSONP no browser para garantir 0 bloqueios de CORS e velocidade máxima
   */
  private fetchJsonp<T>(url: string, timeoutMs = 5000): Promise<T | null> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return Promise.resolve(cached.data as T);
    }

    if (typeof window === 'undefined') {
      return fetch(url).then((res) => res.json()).catch(() => null);
    }

    return new Promise((resolve) => {
      const callbackName = `deezer_cb_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const separator = url.includes('?') ? '&' : '?';
      const scriptUrl = `${url}${separator}output=jsonp&callback=${callbackName}`;

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;

      const timer = setTimeout(() => {
        cleanup();
        resolve(null);
      }, timeoutMs);

      const cleanup = () => {
        clearTimeout(timer);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete (window as any)[callbackName];
      };

      (window as any)[callbackName] = (data: any) => {
        cleanup();
        if (data) {
          this.cache.set(url, { data, timestamp: Date.now() });
          resolve(data as T);
        } else {
          resolve(null);
        }
      };

      script.onerror = () => {
        cleanup();
        resolve(null);
      };

      document.body.appendChild(script);
    });
  }

  async getTrack(id: string): Promise<Track | null> {
    try {
      const url = `https://api.deezer.com/track/${id}`;
      const data = await this.fetchJsonp<any>(url);
      if (data && !data.error) {
        return DeezerAdapter.toDomainTrack(data, 0);
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
   * Busca em todo o catálogo mundial e independente do Deezer (100+ milhões de faixas)
   */
  async search(query: string): Promise<SearchResults> {
    const clean = query.trim();
    if (!clean) {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }

    try {
      const url = `https://api.deezer.com/search?q=${encodeURIComponent(clean)}&limit=30`;
      const data = await this.fetchJsonp<any>(url);

      if (data && data.data && data.data.length > 0) {
        return DeezerAdapter.toDomainSearchResults(data.data);
      }

      return mockMusicProvider.search(query);
    } catch {
      return mockMusicProvider.search(query);
    }
  }

  async getFeaturedTracks(): Promise<Track[]> {
    return mockMusicProvider.getFeaturedTracks();
  }
}

export const deezerMusicProvider = new DeezerMusicProvider();

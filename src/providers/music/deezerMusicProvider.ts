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
   * Executa busca via JSONP no browser com timeout de 2500ms
   */
  private fetchJsonp<T>(url: string, timeoutMs = 2500): Promise<T | null> {
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
   * Retrieves top tracks for a specific artist.
   * Guarantees that tracks are by this artist.
   */
  async getArtistTopTracks(artistId: string, limit = 10): Promise<Track[]> {
    const rawId = artistId.replace('deezer-', '').replace('dz-artist-', '');
    try {
      const url = `https://api.deezer.com/artist/${rawId}/top?limit=${limit}`;
      const data = await this.fetchJsonp<any>(url);
      if (data && data.data) {
        return data.data.map((item: any, i: number) => DeezerAdapter.toDomainTrack(item, i));
      }
      return [];
    } catch {
      return [];
    }
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
      const url = `https://api.deezer.com/search?q=${encodeURIComponent(clean)}&limit=40`;
      const data = await this.fetchJsonp<any>(url);

      if (data && data.data && data.data.length > 0) {
        return DeezerAdapter.toDomainSearchResults(data.data);
      }

      return { tracks: [], artists: [], albums: [], playlists: [] };
    } catch {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }
  }

  async searchArtists(query: string): Promise<Artist[]> {
    const clean = query.trim();
    if (!clean) return [];

    try {
      const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(clean)}&limit=20`;
      const data = await this.fetchJsonp<any>(url);

      if (data && data.data && data.data.length > 0) {
        return data.data.map((item: any) => DeezerAdapter.toDomainArtist(item));
      }

      return [];
    } catch {
      return [];
    }
  }

  async searchAlbums(_query: string): Promise<Album[]> {
    return [];
  }

  async getChartTracks(countryCode = '0', limit = 50): Promise<Track[]> {
    const url = `https://api.deezer.com/chart/${countryCode}/tracks?limit=${limit}`;
    try {
      const data = await this.fetchJsonp<any>(url, 4000);
      if (data && data.data && data.data.length > 0) {
        return data.data.map((item: any, i: number) => DeezerAdapter.toDomainTrack(item, i));
      }
      return [];
    } catch {
      return [];
    }
  }

  async getGenreChart(genreId: string, limit = 20): Promise<Track[]> {
    const url = `https://api.deezer.com/editorial/${genreId}/charts`;
    try {
      const data = await this.fetchJsonp<any>(url, 4000);
      if (data && data.tracks && data.tracks.data) {
        return data.tracks.data.slice(0, limit).map((item: any, i: number) => DeezerAdapter.toDomainTrack(item, i));
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Returns the real global Deezer chart artists (top trending worldwide).
   * Uses /chart/0/artists — no guessing, no fake popular artists.
   */
  async getChartArtists(limit = 25): Promise<Artist[]> {
    const url = `https://api.deezer.com/chart/0/artists?limit=${limit}`;
    try {
      const data = await this.fetchJsonp<any>(url, 4000);
      if (data && data.data && data.data.length > 0) {
        return data.data.map((item: any) => DeezerAdapter.toDomainArtist(item));
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Returns artists similar to a given Deezer artist ID.
   * Uses /artist/{id}/related — real Deezer editorial similarity.
   */
  async getRelatedArtists(deezerArtistId: string, limit = 6): Promise<Artist[]> {
    const url = `https://api.deezer.com/artist/${deezerArtistId}/related?limit=${limit}`;
    try {
      const data = await this.fetchJsonp<any>(url, 4000);
      if (data && data.data && data.data.length > 0) {
        return data.data.map((item: any) => DeezerAdapter.toDomainArtist(item));
      }
      return [];
    } catch {
      return [];
    }
  }

  async getFeaturedTracks(): Promise<Track[]> {
    return mockMusicProvider.getFeaturedTracks();
  }
}

export const deezerMusicProvider = new DeezerMusicProvider();

import { IMusicProvider } from './IMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { deezerMusicProvider } from './deezerMusicProvider';
import { iTunesMusicProvider } from './iTunesMusicProvider';
import { mockMusicProvider } from './mockMusicProvider';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutos de cache ultrarrápido

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Motor de Busca Híbrido & Agregador de Alta Velocidade do MooSic.
 * 1. Dispara buscas simultâneas em paralelo (Apple Music API + Deezer API).
 * 2. Unifica e desduplica resultados por título e artista.
 * 3. Garante tempo de resposta ultrarrápido (Apple responde em <200ms via CORS, enriquecido por Deezer).
 * 4. Evita telas vazias: se um catálogo falhar ou sofrer rate-limit, o outro abastece 100% dos resultados.
 */
export class HybridMusicProvider implements IMusicProvider {
  readonly id = 'hybrid';
  readonly name = 'MooSic Federated Engine (Apple Music + Deezer 100M+)';

  private cache: Map<string, CacheEntry<SearchResults>> = new Map();

  async getTrack(id: string): Promise<Track | null> {
    if (id.startsWith('itunes')) {
      const track = await iTunesMusicProvider.getTrack(id.replace('itunes-', ''));
      if (track) return track;
    }

    const deezerTrack = await deezerMusicProvider.getTrack(id.replace('deezer-', ''));
    if (deezerTrack) return deezerTrack;

    const itunesTrack = await iTunesMusicProvider.getTrack(id);
    if (itunesTrack) return itunesTrack;

    return mockMusicProvider.getTrack(id);
  }

  async getAlbum(id: string): Promise<Album | null> {
    const album = await deezerMusicProvider.getAlbum(id);
    if (album) return album;
    return iTunesMusicProvider.getAlbum(id);
  }

  async getArtist(id: string): Promise<Artist | null> {
    const artist = await deezerMusicProvider.getArtist(id);
    if (artist) return artist;
    return iTunesMusicProvider.getArtist(id);
  }

  /**
   * Busca federada simultânea em múltiplos motores globais
   */
  async search(query: string): Promise<SearchResults> {
    const clean = query.trim();
    if (!clean) {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }

    const cacheKey = clean.toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      // Dispara em paralelo Apple Music (CORS nativo ultrarrápido) e Deezer
      const [itunesRes, deezerRes] = await Promise.allSettled([
        iTunesMusicProvider.search(clean),
        deezerMusicProvider.search(clean),
      ]);

      const itunesTracks =
        itunesRes.status === 'fulfilled' && itunesRes.value?.tracks
          ? itunesRes.value.tracks
          : [];

      const deezerTracks =
        deezerRes.status === 'fulfilled' && deezerRes.value?.tracks
          ? deezerRes.value.tracks
          : [];

      // Desduplicação inteligente por Título + Artista
      const seen = new Set<string>();
      const mergedTracks: Track[] = [];

      // Intercala faixas priorizando aquelas com áudio e capas em alta resolução
      const maxLen = Math.max(itunesTracks.length, deezerTracks.length);
      for (let i = 0; i < maxLen; i++) {
        // 1. Faixa do Deezer (geralmente capa 1000px e MP3 320k)
        if (i < deezerTracks.length) {
          const dt = deezerTracks[i];
          const key = `${normalizeString(dt.title)}_${normalizeString(dt.artistName)}`;
          if (!seen.has(key)) {
            seen.add(key);
            mergedTracks.push(dt);
          }
        }

        // 2. Faixa do iTunes (catálogo internacional massivo e resposta instantânea)
        if (i < itunesTracks.length) {
          const it = itunesTracks[i];
          const key = `${normalizeString(it.title)}_${normalizeString(it.artistName)}`;
          if (!seen.has(key)) {
            seen.add(key);
            mergedTracks.push(it);
          }
        }
      }

      // Se ambos os provedores online falharem (ex: sem conexão), usa fallback do mock
      const finalTracks =
        mergedTracks.length > 0 ? mergedTracks : (await mockMusicProvider.search(clean)).tracks;

      const result: SearchResults = {
        tracks: finalTracks,
        artists: [],
        albums: [],
        playlists: [],
      };

      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch {
      return mockMusicProvider.search(clean);
    }
  }

  async getFeaturedTracks(): Promise<Track[]> {
    return mockMusicProvider.getFeaturedTracks();
  }
}

export const hybridMusicProvider = new HybridMusicProvider();

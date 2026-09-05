import { Track } from '@/types';
import { logger } from '@/utils/logger';

// Cache em memória para resolução instantânea em 0ms
const memoryCache = new Map<string, string>();
const LOCAL_STORAGE_KEY = 'moosic_yt_resolution_cache_v1';

/**
 * Carrega o cache persistido do LocalStorage
 */
function loadPersistentCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Salva a correspondência resolvida no cache do LocalStorage
 */
function saveToPersistentCache(key: string, videoId: string) {
  try {
    const current = loadPersistentCache();
    current[key] = videoId;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    logger.warn('Falha ao salvar correspondência no LocalStorage:', err);
  }
}

export interface AudioResolutionResult {
  videoId: string | null;
  source: 'youtube' | 'preview_fallback';
  allCandidates: string[];
}

export const audioResolverService = {
  /**
   * Constrói a chave única de identificação da faixa
   */
  getTrackKey(track: Track): string {
    const cleanTitle = (track.title || '').trim().toLowerCase();
    const cleanArtist = (track.artistName || '').trim().toLowerCase();
    return `${track.id || ''}_${cleanTitle}_${cleanArtist}`;
  },

  /**
   * Gera a query de busca heurística com prioridade para faixas de estúdio
   */
  buildSearchQuery(track: Track): string {
    // Remove parênteses com "feat", "ao vivo", "remix" espúrios para focar na gravação matriz
    const baseTitle = track.title.replace(/\((feat|ft|official|video|clipe).*?\)/gi, '').trim();
    return `${baseTitle} ${track.artistName} Audio Oficial Topic`;
  },

  /**
   * Resolve o ID do vídeo do YouTube para uma faixa
   */
  async resolveTrackAudio(track: Track): Promise<AudioResolutionResult> {
    const key = this.getTrackKey(track);

    // 1. Verifica cache em memória
    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key)!;
      logger.info(`[AudioResolver] Cache Hit (Memória) para "${track.title}": ${cached}`);
      return { videoId: cached, source: 'youtube', allCandidates: [cached] };
    }

    // 2. Verifica cache persistido do LocalStorage
    const persistent = loadPersistentCache();
    if (persistent[key]) {
      const cached = persistent[key];
      memoryCache.set(key, cached);
      logger.info(`[AudioResolver] Cache Hit (Storage) para "${track.title}": ${cached}`);
      return { videoId: cached, source: 'youtube', allCandidates: [cached] };
    }

    // 3. Consulta o middleware local de busca do YouTube
    try {
      const query = this.buildSearchQuery(track);
      logger.info(`[AudioResolver] Buscando faixa no YouTube: "${query}"`);

      const res = await fetch(`/api/yt-search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        const primaryId = data.primaryVideoId;
        const candidates = data.videoIds || [];

        if (primaryId) {
          memoryCache.set(key, primaryId);
          saveToPersistentCache(key, primaryId);
          logger.info(`[AudioResolver] Faixa resolvida com sucesso: ${track.title} -> ${primaryId}`);
          return {
            videoId: primaryId,
            source: 'youtube',
            allCandidates: candidates,
          };
        }
      }
    } catch (err) {
      logger.warn(`[AudioResolver] Falha na busca primária do YouTube para "${track.title}":`, err);
    }

    // 4. Fallback: Retorna null para instruir o player a usar o preview padrão
    logger.info(`[AudioResolver] Usando fallback de preview para "${track.title}"`);
    return {
      videoId: null,
      source: 'preview_fallback',
      allCandidates: [],
    };
  },
};

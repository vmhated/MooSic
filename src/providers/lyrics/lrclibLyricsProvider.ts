import { TrackSnippetLine } from '@/types/domain/music';

interface LrcEntry {
  seconds: number;
  timeFormatted: string;
  text: string;
}

/**
 * Converte segundos totais em formato mm:ss rigoroso (ex: 75s -> 1:15)
 */
export function formatSecondsToTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Parser de formato padrão de letras sincronizadas LRC: [mm:ss.xx] Texto
 */
export function parseLrcLyrics(lrcString: string): TrackSnippetLine[] {
  if (!lrcString) return [];

  const lines = lrcString.split('\n');
  const result: LrcEntry[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Suporta minutos com 1 ou 2 dígitos: [0:15.20] ou [00:15.20]
    const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
    const matches = Array.from(trimmed.matchAll(timeRegex));
    if (matches.length === 0) continue;

    const text = trimmed.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g, '').trim();
    if (!text || text === '♪' || text === '...' || text.startsWith('Paroles de') || text.startsWith('Lyrics')) continue;

    for (const match of matches) {
      const minutes = parseInt(match[1], 10) || 0;
      const seconds = parseInt(match[2], 10) || 0;
      const millis = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) / 1000 : 0;
      const totalSeconds = minutes * 60 + seconds + millis;
      const formatted = formatSecondsToTime(totalSeconds);

      result.push({
        seconds: totalSeconds,
        timeFormatted: formatted,
        text,
      });
    }
  }

  result.sort((a, b) => a.seconds - b.seconds);

  // Remove versos duplicados consecutivos
  const deduplicated: LrcEntry[] = [];
  for (const item of result) {
    if (deduplicated.length === 0 || deduplicated[deduplicated.length - 1].text !== item.text) {
      deduplicated.push(item);
    }
  }

  return deduplicated.map((item, idx) => ({
    time: item.timeFormatted,
    text: item.text,
    highlight: idx === 1 || idx === 3,
  }));
}

export class LrclibLyricsProvider {
  private cache: Map<string, TrackSnippetLine[]> = new Map();

  /**
   * Busca e sincroniza letras reais através da API aberta LRCLIB
   */
  async fetchLyrics(title: string, artistName: string, durationSeconds?: number): Promise<TrackSnippetLine[] | null> {
    const cleanTitle = title.replace(/\(.*?\)|\[.*?\]/g, '').trim();
    const cleanArtist = artistName.split(/[,&]/)[0].trim();
    const cacheKey = `${cleanArtist.toLowerCase()}-${cleanTitle.toLowerCase()}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) || null;
    }

    try {
      let url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`;
      // Apenas adiciona duration se for a duração completa da música (LRCLIB descarta previews de 30s)
      if (durationSeconds && durationSeconds > 45) {
        url += `&duration=${durationSeconds}`;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'MooSic/1.0.0 (https://moosic.app)',
        },
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        if (data.syncedLyrics) {
          const parsed = parseLrcLyrics(data.syncedLyrics);
          if (parsed.length > 0) {
            this.cache.set(cacheKey, parsed);
            return parsed;
          }
        }
      }

      // Se a busca direta não tiver syncedLyrics, tenta a busca ampla do LRCLIB para achar a versão sincronizada
      const searchController = new AbortController();
      const searchTimer = setTimeout(() => searchController.abort(), 2500);

      const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cleanArtist} ${cleanTitle}`)}`;
      const searchRes = await fetch(searchUrl, {
        signal: searchController.signal,
        headers: { 'User-Agent': 'MooSic/1.0.0 (https://moosic.app)' },
      });
      clearTimeout(searchTimer);

      if (searchRes.ok) {
        const searchList = await searchRes.json();
        if (Array.isArray(searchList) && searchList.length > 0) {
          const syncedItem = searchList.find((s) => s.syncedLyrics);
          if (syncedItem && syncedItem.syncedLyrics) {
            const parsed = parseLrcLyrics(syncedItem.syncedLyrics);
            if (parsed.length > 0) {
              this.cache.set(cacheKey, parsed);
              return parsed;
            }
          }

          // Se nenhuma versão tiver letras sincronizadas, verifica se alguma tem plainLyrics
          const plainItem = searchList.find((s) => s.plainLyrics);
          if (plainItem && plainItem.plainLyrics) {
            const lines = plainItem.plainLyrics
              .split('\n')
              .map((l: string) => l.trim())
              .filter((l: string) => l.length > 0)
              .slice(0, 30);

            const fallbackParsed: TrackSnippetLine[] = lines.map((text: string, i: number) => ({
              time: formatSecondsToTime(10 + i * 10),
              text,
              highlight: i === 1,
            }));

            if (fallbackParsed.length > 0) {
              this.cache.set(cacheKey, fallbackParsed);
              return fallbackParsed;
            }
          }
        }
      }
    } catch {
      // Ignora falhas de conexão
    }

    return null;
  }
}

export const lrclibLyricsProvider = new LrclibLyricsProvider();

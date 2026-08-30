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
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const matches = Array.from(trimmed.matchAll(timeRegex));
    if (matches.length === 0) continue;

    const text = trimmed.replace(timeRegex, '').trim();
    if (!text || text === '♪' || text === '...' || text.startsWith('Paroles de') || text.startsWith('Lyrics')) continue;

    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const totalSeconds = minutes * 60 + seconds;
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
      if (durationSeconds && durationSeconds > 0) {
        url += `&duration=${durationSeconds}`;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);

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
        } else if (data.plainLyrics) {
          const lines = data.plainLyrics
            .split('\n')
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 0)
            .slice(0, 16);

          const fallbackParsed: TrackSnippetLine[] = lines.map((text: string, i: number) => ({
            time: formatSecondsToTime(12 + i * 16),
            text,
            highlight: i === 1,
          }));

          if (fallbackParsed.length > 0) {
            this.cache.set(cacheKey, fallbackParsed);
            return fallbackParsed;
          }
        }
      }

      // Se a busca exata falhar, tenta busca ampla no LRCLIB
      const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cleanArtist} ${cleanTitle}`)}`;
      const searchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': 'MooSic/1.0.0 (https://moosic.app)' },
      });

      if (searchRes.ok) {
        const searchList = await searchRes.json();
        if (Array.isArray(searchList) && searchList.length > 0) {
          const first = searchList.find((s) => s.syncedLyrics) || searchList[0];
          if (first && first.syncedLyrics) {
            const parsed = parseLrcLyrics(first.syncedLyrics);
            if (parsed.length > 0) {
              this.cache.set(cacheKey, parsed);
              return parsed;
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

import { Track, SearchResults } from '@/types/domain/music';

// Harmonious ambient palettes for dynamic atmosphere
const ACCENT_PALETTES = [
  { accent: '#8B5CF6', rgb: '139, 92, 246' },
  { accent: '#3B82F6', rgb: '59, 130, 246' },
  { accent: '#EC4899', rgb: '236, 72, 153' },
  { accent: '#10B981', rgb: '16, 185, 129' },
  { accent: '#F59E0B', rgb: '245, 158, 11' },
  { accent: '#A855F7', rgb: '168, 85, 247' },
  { accent: '#06B6D4', rgb: '6, 182, 212' },
  { accent: '#E11D48', rgb: '225, 29, 72' },
];

function getStableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '3:45';
  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  return `${minutes}:${remSec < 10 ? '0' : ''}${remSec}`;
}

export class DeezerAdapter {
  /**
   * Converte o item bruto da API do Deezer para a entidade de domínio Track do MooSic.
   * Utiliza cover_xl ou cover_big para máxima qualidade de estúdio (1000x1000px).
   */
  static toDomainTrack(item: any, index = 0): Track {
    const title = item.title_short || item.title || 'Faixa sem título';
    const artistName = item.artist?.name || 'Artista Desconhecido';
    const albumTitle = item.album?.title || 'Single';

    // Capa original em alta resolução (1000x1000px) do Deezer
    let coverUrl =
      item.album?.cover_xl ||
      item.album?.cover_big ||
      item.album?.cover_medium ||
      item.artist?.picture_xl ||
      item.artist?.picture_big ||
      '';

    if (coverUrl.includes('500x500')) {
      coverUrl = coverUrl.replace('500x500', '1000x1000');
    }

    const hash = getStableHash(`${title}-${artistName}`);
    const palette = ACCENT_PALETTES[(index + hash) % ACCENT_PALETTES.length];
    const durationSeconds = item.duration || 210;

    return {
      id: String(item.id || `deezer-${hash}`),
      title,
      artistId: String(item.artist?.id || `deezer-artist-${hash}`),
      artistName,
      albumId: String(item.album?.id || `deezer-album-${hash}`),
      albumTitle,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85',
      durationSeconds,
      durationFormatted: formatDuration(durationSeconds),
      audioUrl: item.preview || undefined, // MP3 oficial de estúdio
      genre: 'Global Sound',
      accent: palette.accent,
      accentRgb: palette.rgb,
      badge: item.explicit_lyrics ? 'Explicit • Hi-Res' : 'Hi-Res Master',
      lyricsSnippet: [
        { time: '0:14', text: `Lost in the rhythm of ${title}` },
        { time: '0:32', text: `Where the sound of ${artistName} takes control`, highlight: true },
        { time: '0:50', text: `Echoes of ${albumTitle} through the open sky` },
        { time: '1:10', text: 'Music that moves without limits' },
      ],
      isExplicit: Boolean(item.explicit_lyrics),
      providerId: 'deezer',
      providerTrackId: String(item.id || hash),
    };
  }

  static toDomainSearchResults(results: any[]): SearchResults {
    const seen = new Set<string>();
    const tracks: Track[] = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      const key = `${(item.title || '').toLowerCase()}-${(item.artist?.name || '').toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      tracks.push(DeezerAdapter.toDomainTrack(item, tracks.length));
      if (tracks.length >= 25) break;
    }

    return {
      tracks,
      artists: [],
      albums: [],
      playlists: [],
    };
  }
}

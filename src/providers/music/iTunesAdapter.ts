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

function formatDuration(ms?: number): string {
  if (!ms || ms <= 0) return '3:45';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export class ITunesAdapter {
  /**
   * Converte o item bruto da API do iTunes para a entidade de domínio Track do MooSic.
   * Converte artwork de 100x100 para 600x600bb em alta definição e proporção quadrada 1:1 perfeita.
   */
  static toDomainTrack(item: any, index = 0): Track {
    const title = item.trackName || item.collectionName || 'Faixa sem título';
    const artistName = item.artistName || 'Artista Desconhecido';
    const albumTitle = item.collectionName || item.trackName || 'Single';

    // Upgrade da capa para alta definição 600x600bb perfeita
    let coverUrl = item.artworkUrl100 || '';
    if (coverUrl.includes('100x100bb')) {
      coverUrl = coverUrl.replace('100x100bb', '600x600bb');
    } else if (coverUrl.includes('60x60bb')) {
      coverUrl = coverUrl.replace('60x60bb', '600x600bb');
    }

    const hash = getStableHash(`${title}-${artistName}`);
    const palette = ACCENT_PALETTES[(index + hash) % ACCENT_PALETTES.length];
    const durationSeconds = item.trackTimeMillis ? Math.floor(item.trackTimeMillis / 1000) : 210;

    return {
      id: String(item.trackId || item.collectionId || `itunes-${hash}`),
      title,
      artistId: String(item.artistId || `itunes-artist-${hash}`),
      artistName,
      albumId: String(item.collectionId || `itunes-album-${hash}`),
      albumTitle,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85',
      durationSeconds,
      durationFormatted: formatDuration(item.trackTimeMillis),
      audioUrl: item.previewUrl || undefined,
      genre: item.primaryGenreName || 'Studio Master',
      accent: palette.accent,
      accentRgb: palette.rgb,
      badge: item.trackExplicitness === 'explicit' ? 'Explicit • Hi-Res' : 'Hi-Res Lossless',
      lyricsSnippet: [
        { time: '0:12', text: `Lost in the rhythm of ${title}` },
        { time: '0:28', text: `Where the sound of ${artistName} takes control`, highlight: true },
        { time: '0:45', text: `Echoes of ${albumTitle} through the open sky` },
        { time: '1:02', text: 'Music that moves without limits' },
      ],
      isExplicit: item.trackExplicitness === 'explicit',
      providerId: 'itunes',
      providerTrackId: String(item.trackId || hash),
    };
  }

  static toDomainSearchResults(results: any[]): SearchResults {
    const seen = new Set<string>();
    const tracks: Track[] = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      const key = `${(item.trackName || '').toLowerCase()}-${(item.artistName || '').toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      tracks.push(ITunesAdapter.toDomainTrack(item, tracks.length));
      if (tracks.length >= 20) break;
    }

    return {
      tracks,
      artists: [],
      albums: [],
      playlists: [],
    };
  }
}

import { Track, SearchResults } from '@/types/domain/music';

// Curated palette of ambient accents for dynamic atmosphere
const ACCENT_PALETTES = [
  { accent: '#8B5CF6', rgb: '139, 92, 246', genre: 'Hi-Res Lossless' },
  { accent: '#3B82F6', rgb: '59, 130, 246', genre: 'Master Audio' },
  { accent: '#EC4899', rgb: '236, 72, 153', genre: 'Spatial Sound' },
  { accent: '#10B981', rgb: '16, 185, 129', genre: 'Ultra HD' },
  { accent: '#F59E0B', rgb: '245, 158, 11', genre: 'Direct DAC' },
  { accent: '#A855F7', rgb: '168, 85, 247', genre: 'Studio Master' },
];

const FALLBACK_ARTWORKS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
];

/**
 * Formata milissegundos para string 'M:SS'
 */
function formatDuration(ms?: number): string {
  if (!ms || ms <= 0) return '3:45';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export class MusicBrainzAdapter {
  /**
   * Converte uma gravação bruta do MusicBrainz em um modelo de domínio Track do MooSic.
   */
  static toDomainTrack(raw: any, index = 0, customCoverUrl?: string): Track {
    const artistCredit = raw['artist-credit']?.[0];
    const artistName = artistCredit?.name || artistCredit?.artist?.name || 'Artista Desconhecido';
    const artistId = artistCredit?.artist?.id || `mb-artist-${raw.id}`;

    const release = raw.releases?.[0];
    const albumTitle = release?.title || 'Single';
    const albumId = release?.id || `mb-release-${raw.id}`;

    // Resolução de capa (Cover Art Archive ou fallback)
    const coverUrl =
      customCoverUrl ||
      (release?.id ? `https://coverartarchive.org/release/${release.id}/front-500` : null) ||
      FALLBACK_ARTWORKS[index % FALLBACK_ARTWORKS.length];

    const palette = ACCENT_PALETTES[index % ACCENT_PALETTES.length];
    const durationSeconds = raw.length ? Math.floor(raw.length / 1000) : 210;

    return {
      id: raw.id,
      title: raw.title || 'Faixa sem título',
      artistId,
      artistName,
      albumId,
      albumTitle,
      coverUrl,
      durationSeconds,
      durationFormatted: formatDuration(raw.length),
      genre: raw.tags?.[0]?.name || palette.genre,
      accent: palette.accent,
      accentRgb: palette.rgb,
      badge: 'MusicBrainz Verified',
      lyricsSnippet: [
        { time: '0:15', text: 'Lost in the frequency of endless sound' },
        { time: '0:30', text: `Echoes of ${raw.title || 'the rhythm'} through the night`, highlight: true },
        { time: '0:48', text: 'Where every heartbeat meets the infinite flow' },
        { time: '1:05', text: 'Music that moves without limits' },
      ],
      isExplicit: Boolean(raw.disambiguation?.toLowerCase().includes('explicit')),
      providerId: 'musicbrainz',
      providerTrackId: raw.id,
    };
  }

  /**
   * Converte resultado de busca em modelo de domínio SearchResults.
   */
  static toDomainSearchResults(recordings: any[]): SearchResults {
    const tracks = recordings.map((rec, idx) => MusicBrainzAdapter.toDomainTrack(rec, idx));
    return {
      tracks,
      artists: [],
      albums: [],
      playlists: [],
    };
  }
}

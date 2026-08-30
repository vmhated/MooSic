import { IMusicProvider } from './IMusicProvider';
import { Track, Album, Artist, SearchResults } from '@/types/domain/music';
import { MOCK_HERO_TRACKS } from '@/features/landing/data/mockMusicData';

/**
 * Converte MockTrack local para o modelo de domínio Track
 */
function toDomainTrack(mock: typeof MOCK_HERO_TRACKS[0]): Track {
  const parts = mock.duration.split(':');
  const durationSeconds = parts.length === 2 ? parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) : 210;

  return {
    id: mock.id,
    title: mock.title,
    artistId: `artist-${mock.id}`,
    artistName: mock.artist,
    albumId: `album-${mock.id}`,
    albumTitle: mock.album,
    coverUrl: mock.artwork,
    durationSeconds,
    durationFormatted: mock.duration,
    genre: mock.genre,
    accent: mock.accent,
    accentRgb: mock.accentRgb,
    badge: mock.badge,
    lyricsSnippet: mock.lyricsSnippet,
    isExplicit: false,
    providerId: 'mock',
    providerTrackId: mock.id,
  };
}

export class MockMusicProvider implements IMusicProvider {
  readonly id = 'mock';
  readonly name = 'MooSic Curated Mock Provider';

  private tracks: Track[] = MOCK_HERO_TRACKS.map(toDomainTrack);

  async getTrack(id: string): Promise<Track | null> {
    const found = this.tracks.find((t) => t.id === id);
    return found || null;
  }

  async getAlbum(id: string): Promise<Album | null> {
    const track = this.tracks.find((t) => t.albumId === id);
    if (!track) return null;
    return {
      id: track.albumId || id,
      title: track.albumTitle || 'Álbum',
      artistId: track.artistId,
      artistName: track.artistName,
      coverUrl: track.coverUrl,
      releaseYear: 2024,
      totalTracks: 10,
      genres: [track.genre || 'Electronic'],
    };
  }

  async getArtist(id: string): Promise<Artist | null> {
    const track = this.tracks.find((t) => t.artistId === id);
    if (!track) return null;
    return {
      id: track.artistId,
      name: track.artistName,
      genres: [track.genre || 'Music'],
    };
  }

  async search(query: string): Promise<SearchResults> {
    const q = query.toLowerCase();
    const matched = this.tracks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artistName.toLowerCase().includes(q)
    );
    return {
      tracks: matched,
      artists: [],
      albums: [],
      playlists: [],
    };
  }

  async getFeaturedTracks(): Promise<Track[]> {
    return [...this.tracks];
  }
}

export const mockMusicProvider = new MockMusicProvider();

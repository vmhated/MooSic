/**
 * Entidades Principais do Domínio de Música do MooSic
 */

export interface Artist {
  id: string;
  name: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  genres: string[];
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  releaseYear?: number;
  totalTracks?: number;
  genres?: string[];
}

export interface TrackSnippetLine {
  time: string;
  text: string;
  highlight?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  coverUrl: string; // Resolved high-res artwork
  durationSeconds: number;
  durationFormatted?: string; // e.g. '3:45'
  audioUrl?: string; // Mock audio in Phase 2.5
  genre?: string;
  accent?: string; // Ambient color extraction (hex)
  accentRgb?: string; // Ambient color extraction (rgb)
  badge?: string;
  lyricsSnippet?: TrackSnippetLine[]; // Mock lyrics in Phase 2.5
  isExplicit: boolean;
  providerId: string; // 'musicbrainz' | 'mock'
  providerTrackId: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  trackCount: number;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

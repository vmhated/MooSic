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
  releaseYear: number;
  totalTracks: number;
  genres: string[];
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  coverUrl: string;
  durationSeconds: number;
  audioUrl?: string;
  isExplicit: boolean;
  providerId: string; // Ex: 'musicbrainz', 'jamendo', 'local'
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

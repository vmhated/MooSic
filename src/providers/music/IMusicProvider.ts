import { Track, Album, Artist, SearchResults } from '@/types/domain/music';

/**
 * Interface genérica para Provedores de Música.
 * Permite plugar diferentes APIs (ex: MusicBrainz, Jamendo, API Própria)
 * sem acoplar a UI ou as telas do MooSic.
 */
export interface IMusicProvider {
  readonly id: string;
  readonly name: string;

  getTrack(id: string): Promise<Track | null>;
  getAlbum(id: string): Promise<Album | null>;
  getArtist(id: string): Promise<Artist | null>;
  search(query: string): Promise<SearchResults>;
  getFeaturedTracks(): Promise<Track[]>;
}

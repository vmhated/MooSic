import { Track, Album, Artist } from '@/types/domain/music';

/**
 * Interface para Provedores de Metadados (ex: MusicBrainz, Last.fm, Discogs)
 */
export interface IMetadataProvider {
  readonly id: string;
  readonly name: string;

  fetchTrackMetadata(trackId: string): Promise<Partial<Track> | null>;
  fetchAlbumMetadata(albumId: string): Promise<Partial<Album> | null>;
  fetchArtistMetadata(artistId: string): Promise<Partial<Artist> | null>;
}

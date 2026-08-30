import { IMetadataProvider } from '@/providers/metadata/IMetadataProvider';
import { Track, Album, Artist } from '@/types/domain/music';

/**
 * Service de Orquestração de Metadados Adicionais
 */
export class MetadataService {
  private provider: IMetadataProvider | null = null;

  constructor(provider?: IMetadataProvider) {
    if (provider) {
      this.provider = provider;
    }
  }

  public setProvider(provider: IMetadataProvider): void {
    this.provider = provider;
  }

  public async getTrackDetails(trackId: string): Promise<Partial<Track> | null> {
    if (!this.provider) throw new Error('MetadataProvider não inicializado.');
    return this.provider.fetchTrackMetadata(trackId);
  }

  public async getAlbumDetails(albumId: string): Promise<Partial<Album> | null> {
    if (!this.provider) throw new Error('MetadataProvider não inicializado.');
    return this.provider.fetchAlbumMetadata(albumId);
  }

  public async getArtistDetails(artistId: string): Promise<Partial<Artist> | null> {
    if (!this.provider) throw new Error('MetadataProvider não inicializado.');
    return this.provider.fetchArtistMetadata(artistId);
  }
}

export const metadataService = new MetadataService();

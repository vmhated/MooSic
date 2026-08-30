import { ILyricsProvider } from '@/providers/lyrics/ILyricsProvider';
import { LyricsData } from '@/types/domain/lyrics';

/**
 * Service de Orquestração de Letras
 */
export class LyricsService {
  private provider: ILyricsProvider | null = null;

  constructor(provider?: ILyricsProvider) {
    if (provider) {
      this.provider = provider;
    }
  }

  public setProvider(provider: ILyricsProvider): void {
    this.provider = provider;
  }

  public async getLyrics(trackId: string, trackTitle: string, artistName: string): Promise<LyricsData | null> {
    if (!this.provider) throw new Error('LyricsProvider não inicializado.');
    return this.provider.getLyrics(trackId, trackTitle, artistName);
  }
}

export const lyricsService = new LyricsService();

import { LyricsData } from '@/types/domain/lyrics';

/**
 * Interface para Provedores de Letras (normais e sincronizadas)
 */
export interface ILyricsProvider {
  readonly id: string;
  readonly name: string;

  getLyrics(trackId: string, trackTitle: string, artistName: string): Promise<LyricsData | null>;
}

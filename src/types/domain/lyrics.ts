/**
 * Estrutura para Letras Simples e Letras Sincronizadas
 */

export interface LyricLine {
  id: string;
  text: string;
}

export interface SyncedLyricLine extends LyricLine {
  startTime: number; // Em segundos ou milissegundos
  endTime?: number;
}

export type LyricsType = 'plain' | 'synced' | 'instrumental' | 'none';

export interface LyricsData {
  trackId: string;
  type: LyricsType;
  plainLyrics?: LyricLine[];
  syncedLyrics?: SyncedLyricLine[];
  copyright?: string;
  providerId: string;
}

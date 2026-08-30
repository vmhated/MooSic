import { useState } from 'react';
import { LyricsData } from '@/types/domain/lyrics';

/**
 * Hook de abstração para gerenciamento de letras e sincronização com o tempo da música.
 */
export function useLyrics(_trackId?: string) {
  const [lyrics] = useState<LyricsData | null>(null);
  const [isLoading] = useState<boolean>(false);
  const [currentLineIndex] = useState<number>(-1);

  return {
    lyrics,
    isLoading,
    currentLineIndex,
  };
}

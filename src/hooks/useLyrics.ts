import { useState, useEffect } from 'react';
import { Track, TrackSnippetLine } from '@/types/domain/music';
import { lrclibLyricsProvider } from '@/providers/lyrics/lrclibLyricsProvider';

export interface UseLyricsResult {
  lines: TrackSnippetLine[];
  loading: boolean;
  isRealSynced: boolean;
  hasLyrics: boolean;
}

/**
 * Hook para carregar e co-relacionar letras sincronizadas em tempo real via LRCLIB
 */
function isValidSnippet(snippet?: TrackSnippetLine[]): boolean {
  if (!snippet || snippet.length === 0) return false;
  return !snippet.some((l) => l.text.includes('Lost in the rhythm'));
}

export function useLyrics(track: Track): UseLyricsResult {
  const initialValid = isValidSnippet(track.lyricsSnippet);
  const [lines, setLines] = useState<TrackSnippetLine[]>(() => {
    return initialValid && track.lyricsSnippet ? track.lyricsSnippet : [];
  });
  const [loading, setLoading] = useState(false);
  const [isRealSynced, setIsRealSynced] = useState(false);
  const [hasLyrics, setHasLyrics] = useState(initialValid);

  useEffect(() => {
    let isMounted = true;

    async function loadRealLyrics() {
      if (!track.title || !track.artistName) return;

      setLoading(true);

      try {
        const realSynced = await lrclibLyricsProvider.fetchLyrics(
          track.title,
          track.artistName,
          track.durationSeconds
        );

        if (isMounted) {
          if (realSynced && realSynced.length > 0) {
            setLines(realSynced);
            setIsRealSynced(true);
            setHasLyrics(true);
          } else if (isValidSnippet(track.lyricsSnippet) && track.lyricsSnippet) {
            setLines(track.lyricsSnippet);
            setIsRealSynced(false);
            setHasLyrics(true);
          } else {
            setLines([]);
            setIsRealSynced(false);
            setHasLyrics(false);
          }
        }
      } catch {
        if (isMounted) {
          if (isValidSnippet(track.lyricsSnippet) && track.lyricsSnippet) {
            setLines(track.lyricsSnippet);
            setIsRealSynced(false);
            setHasLyrics(true);
          } else {
            setLines([]);
            setIsRealSynced(false);
            setHasLyrics(false);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRealLyrics();

    return () => {
      isMounted = false;
    };
  }, [track.id, track.title, track.artistName, track.durationSeconds]);

  return { lines, loading, isRealSynced, hasLyrics };
}

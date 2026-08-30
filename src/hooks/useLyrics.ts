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
export function useLyrics(track: Track): UseLyricsResult {
  const [lines, setLines] = useState<TrackSnippetLine[]>(() => {
    return track.lyricsSnippet || [];
  });
  const [loading, setLoading] = useState(false);
  const [isRealSynced, setIsRealSynced] = useState(false);
  const [hasLyrics, setHasLyrics] = useState(true);

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
          } else if (track.lyricsSnippet && track.lyricsSnippet.length > 0) {
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
          if (track.lyricsSnippet && track.lyricsSnippet.length > 0) {
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

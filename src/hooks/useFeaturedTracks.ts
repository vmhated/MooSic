import { useState, useEffect } from 'react';
import { Track } from '@/types/domain/music';
import { musicService } from '@/services/music/musicService';
import { mockMusicProvider } from '@/providers/music/mockMusicProvider';

export interface UseFeaturedTracksReturn {
  tracks: Track[];
  loading: boolean;
  error: Error | null;
  isFallback: boolean;
}

/**
 * Hook para carregar faixas em destaque da fundação de metadados.
 * Inicializa imediatamente com dataset de alta fidelidade para garantir zero flash/spinner
 * e atualiza transparentemente com dados do MusicBrainz em background.
 */
export function useFeaturedTracks(): UseFeaturedTracksReturn {
  const [tracks, setTracks] = useState<Track[]>(() => {
    // Inicialização síncrona segura para evitar qualquer frame em branco
    return [
      {
        id: 'track-1',
        title: 'Neon Orbit',
        artistId: 'artist-1',
        artistName: 'Aether Echo',
        albumId: 'album-1',
        albumTitle: 'Parallel Horizons',
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        durationSeconds: 222,
        durationFormatted: '3:42',
        genre: 'Electronic Ambient',
        accent: '#8B5CF6',
        accentRgb: '139, 92, 246',
        badge: 'Hi-Res Lossless',
        lyricsSnippet: [
          { time: '0:14', text: 'Lost in the frequency of endless sound' },
          { time: '0:28', text: 'Where echoes meet the morning ground', highlight: true },
          { time: '0:42', text: 'Drifting further than we used to know' },
          { time: '0:56', text: 'Caught inside the infinite flow' },
        ],
        isExplicit: false,
        providerId: 'mock',
        providerTrackId: 'track-1',
      },
    ];
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTracks() {
      try {
        setLoading(true);
        const resolved = await musicService.getFeaturedTracks();
        if (isMounted && resolved && resolved.length > 0) {
          setTracks(resolved);
          setIsFallback(resolved[0]?.providerId === 'mock');
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          const fallback = await mockMusicProvider.getFeaturedTracks();
          setTracks(fallback);
          setIsFallback(true);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTracks();

    return () => {
      isMounted = false;
    };
  }, []);

  return { tracks, loading, error, isFallback };
}

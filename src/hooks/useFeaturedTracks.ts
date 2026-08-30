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
 * Inicializa imediatamente com as capas oficiais dos álbuns (Racionais MC's, Sabotage, BK', Matuê, Criolo, Daft Punk)
 * e atualiza em segundo plano via iTunes/MusicBrainz.
 */
export function useFeaturedTracks(): UseFeaturedTracksReturn {
  const [tracks, setTracks] = useState<Track[]>(() => {
    return [
      {
        id: 'racionais-vida-loka',
        title: 'Vida Loka (Pt. 1)',
        artistId: 'artist-racionais',
        artistName: "Racionais MC's",
        albumId: 'album-nada-como-um-dia',
        albumTitle: 'Nada como um Dia após o Outro Dia',
        coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3f/ca/fd/3fcafdad-07c1-c752-7878-39dfd32b3b28/0.jpg/600x600bb.jpg',
        durationSeconds: 303,
        durationFormatted: '5:03',
        genre: 'Rap Nacional / Hip-Hop',
        accent: '#8B5CF6',
        accentRgb: '139, 92, 246',
        badge: 'MooSic Masterpiece',
        lyricsSnippet: [
          { time: '0:15', text: 'Fé em Deus que ele é justo, ei, irmão, nunca se esqueça' },
          { time: '0:32', text: 'Na caminhada tem que ser um passo de cada vez', highlight: true },
          { time: '0:50', text: 'Vida loka, cabulosa, o tempo passa e a gente aprende' },
          { time: '1:10', text: 'Um brinde aos guerreiros que estão na luta' },
        ],
        isExplicit: true,
        providerId: 'curated',
        providerTrackId: 'racionais-vida-loka',
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

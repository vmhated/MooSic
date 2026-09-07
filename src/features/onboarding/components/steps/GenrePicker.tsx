import React, { useState, useEffect, useCallback } from 'react';
import { useOnboarding } from '../../stores/OnboardingContext';
import { musicService } from '@/services/music/musicService';
import { Check } from 'lucide-react';

// Genre has a name and a source artist for traceability
interface GenreWithSource {
  name: string;
  sourceArtist: string;
}

export const GenrePicker: React.FC = () => {
  const { draft, updateDraft, next, back } = useOnboarding();
  const [availableGenres, setAvailableGenres] = useState<GenreWithSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const selectedGenres = draft.favorite_genres || [];

  // Derive genres from the selected artists' real track data
  useEffect(() => {
    const deriveGenres = async () => {
      if (!draft.favorite_artists || draft.favorite_artists.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const seen = new Set<string>();
      const genres: GenreWithSource[] = [];

      // For each selected artist, fetch their real track genres
      await Promise.allSettled(
        draft.favorite_artists.slice(0, 5).map(async (artist) => {
          try {
            const artistGenres = await musicService.getArtistGenres(artist.name);
            for (const g of artistGenres) {
              if (!seen.has(g.toLowerCase())) {
                seen.add(g.toLowerCase());
                genres.push({ name: g, sourceArtist: artist.name });
              }
            }
          } catch {
            // Provider failed for this artist — skip silently
          }
        })
      );

      setAvailableGenres(genres);
      setLoading(false);
    };

    deriveGenres();
  }, [draft.favorite_artists]);

  // Debounced genre search (free-form, from real providers)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await musicService.getArtistGenres(searchQuery);
        // Merge with already known genres, deduplicate
        const known = new Set(availableGenres.map(g => g.name.toLowerCase()));
        setSearchResults(results.filter(g => !known.has(g.toLowerCase())));
      } catch {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, availableGenres]);

  const isSelected = useCallback(
    (genreName: string) => selectedGenres.some(g => g.name.toLowerCase() === genreName.toLowerCase()),
    [selectedGenres]
  );

  const toggleGenre = useCallback(
    (genreName: string) => {
      const isAlreadySelected = isSelected(genreName);
      if (isAlreadySelected) {
        updateDraft({
          favorite_genres: selectedGenres.filter(g => g.name.toLowerCase() !== genreName.toLowerCase()),
        });
      } else {
        const entity = {
          provider: 'system',
          provider_id: genreName.toLowerCase().replace(/\s+/g, '-'),
          name: genreName,
          source: 'declared' as const,
          confidence: 1.0,
          added_at: new Date().toISOString(),
        };
        updateDraft({ favorite_genres: [...selectedGenres, entity] });
      }
    },
    [isSelected, selectedGenres, updateDraft]
  );

  const allDisplayedGenres = [
    ...availableGenres,
    ...searchResults.map(g => ({ name: g, sourceArtist: '' })),
  ];

  return (
    <div className="flex flex-col min-h-screen w-full max-w-4xl mx-auto p-6 sm:p-12 animate-fade-in pt-20 pb-32">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <button onClick={back} className="text-xs text-text-muted font-bold uppercase tracking-widest hover:text-white transition-colors mb-4 flex items-center gap-2">
          ← Voltar
        </button>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          Que tipos de som <span className="text-brand-light">definem você?</span>
        </h2>
        <p className="text-text-muted font-medium">
          {draft.favorite_artists && draft.favorite_artists.length > 0
            ? `Baseado nos seus artistas, encontramos esses gêneros.`
            : 'Busque gêneros que descrevem a sua música.'}
        </p>
      </div>

      {/* Explore by search */}
      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Explorar outros gêneros..."
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white font-medium focus:outline-none focus:border-brand-light transition-all placeholder:text-text-muted/50"
        />
      </div>

      {/* Genre Grid */}
      {loading ? (
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-brand-light border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium">Descobrindo gêneros reais dos seus artistas...</span>
        </div>
      ) : allDisplayedGenres.length === 0 ? (
        <div className="text-text-muted font-medium py-10 text-center">
          {draft.favorite_artists?.length === 0
            ? 'Adicione artistas na etapa anterior para ver sugestões de gêneros reais.'
            : 'Nenhum gênero encontrado. Tente buscar manualmente acima.'}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {allDisplayedGenres.map((genre) => {
            const selected = isSelected(genre.name);
            return (
              <button
                key={genre.name}
                onClick={() => toggleGenre(genre.name)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 border ${
                  selected
                    ? 'bg-brand-light text-white border-brand-light shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105'
                    : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30 hover:bg-white/10 hover:scale-105'
                }`}
              >
                {selected && <Check className="w-3.5 h-3.5" />}
                <span>{genre.name}</span>
                {genre.sourceArtist && !selected && (
                  <span className="text-[10px] text-text-muted ml-1 opacity-60">
                    via {genre.sourceArtist.split(' ')[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 bg-[#1A1B23] border border-white/10 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md">
          <span className="text-sm font-bold text-white">
            {selectedGenres.length} {selectedGenres.length === 1 ? 'gênero' : 'gêneros'}
          </span>
          <div className="w-px h-6 bg-white/20"></div>
          <button
            onClick={next}
            className="px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
          >
            {selectedGenres.length > 0 ? 'Continuar' : 'Pular Etapa'}
          </button>
        </div>
      </div>
    </div>
  );
};

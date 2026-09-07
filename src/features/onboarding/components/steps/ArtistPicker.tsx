import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOnboarding } from '../../stores/OnboardingContext';
import { musicService } from '@/services/music/musicService';
import { Artist } from '@/types/domain/music';
import { Search, Check, X } from 'lucide-react';

interface SuggestedSection {
  sourceArtistName: string;
  artists: Artist[];
}

export const ArtistPicker: React.FC = () => {
  const { draft, updateDraft, next, service } = useOnboarding();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [chartArtists, setChartArtists] = useState<Artist[]>([]);
  const [relatedSections, setRelatedSections] = useState<SuggestedSection[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingChart, setLoadingChart] = useState(true);
  const [fetchingRelated, setFetchingRelated] = useState(false);

  // Track which artist IDs we've already fetched related for
  const fetchedRelatedFor = useRef(new Set<string>());
  // Track all displayed artist IDs to avoid duplicates across sections
  const displayedIds = useRef(new Set<string>());

  const selectedArtists = draft.favorite_artists || [];
  const isSearchMode = query.trim().length > 0;

  // Build a unified set of all currently displayed IDs for deduplication
  const rebuildDisplayedIds = useCallback((chart: Artist[], sections: SuggestedSection[]) => {
    const ids = new Set<string>();
    chart.forEach(a => ids.add(a.id));
    sections.forEach(s => s.artists.forEach(a => ids.add(a.id)));
    displayedIds.current = ids;
  }, []);

  // Load chart artists on mount
  useEffect(() => {
    const load = async () => {
      try {
        const featured = await musicService.getFeaturedArtists();
        setChartArtists(featured);
        rebuildDisplayedIds(featured, []);
      } finally {
        setLoadingChart(false);
      }
    };
    load();
  }, [rebuildDisplayedIds]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }
    setLoadingSearch(true);
    const timer = setTimeout(async () => {
      try {
        const artists = await musicService.searchArtists(trimmed);
        setSearchResults(artists);
      } catch {
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // When an artist is selected, fetch related artists and inject them
  const fetchAndInjectRelated = useCallback(async (artist: Artist) => {
    const key = `${artist.providerId}-${artist.providerArtistId}`;
    if (fetchedRelatedFor.current.has(key) || artist.providerId !== 'deezer') return;
    fetchedRelatedFor.current.add(key);

    setFetchingRelated(true);
    try {
      const related = await musicService.getRelatedArtists({
        provider: artist.providerId,
        providerArtistId: artist.providerArtistId,
      });

      // Filter out artists already displayed anywhere
      const fresh = related.filter(a => !displayedIds.current.has(a.id));
      if (fresh.length === 0) return;

      setRelatedSections(prev => {
        const next = [...prev, { sourceArtistName: artist.name, artists: fresh }];
        rebuildDisplayedIds(chartArtists, next);
        return next;
      });
    } finally {
      setFetchingRelated(false);
    }
  }, [chartArtists, rebuildDisplayedIds]);

  const isSelected = useCallback(
    (artist: Artist) =>
      selectedArtists.some(
        (a) => a.provider === artist.providerId && a.provider_id === artist.providerArtistId
      ),
    [selectedArtists]
  );

  const toggleArtist = useCallback(
    (artist: Artist) => {
      if (isSelected(artist)) {
        updateDraft({
          favorite_artists: selectedArtists.filter(
            (a) => !(a.provider === artist.providerId && a.provider_id === artist.providerArtistId)
          ),
        });
      } else {
        const entity = service.artistToTasteEntity(artist, 'declared');
        updateDraft({ favorite_artists: [...selectedArtists, entity] });
        // Trigger related artist injection
        fetchAndInjectRelated(artist);
      }
    },
    [isSelected, selectedArtists, updateDraft, service, fetchAndInjectRelated]
  );

  const removeSelected = useCallback(
    (provider: string, providerId: string) => {
      updateDraft({
        favorite_artists: selectedArtists.filter(
          (a) => !(a.provider === provider && a.provider_id === providerId)
        ),
      });
    },
    [selectedArtists, updateDraft]
  );

  const ArtistCard = ({ artist }: { artist: Artist }) => {
    const selected = isSelected(artist);
    return (
      <button
        onClick={() => toggleArtist(artist)}
        className="flex flex-col items-center gap-2.5 group text-center focus:outline-none"
      >
        <div
          className={`relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden transition-all duration-200 ${
            selected
              ? 'ring-[3px] ring-brand-light scale-110 shadow-[0_0_22px_rgba(139,92,246,0.5)]'
              : 'ring-2 ring-transparent group-hover:ring-white/20 group-hover:scale-105'
          }`}
        >
          {artist.avatarUrl ? (
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
              }}
            />
          ) : null}
          <div className={`${artist.avatarUrl ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-white/10 text-lg font-black text-white/50`}>
            {artist.name.charAt(0).toUpperCase()}
          </div>

          {selected && (
            <div className="absolute inset-0 bg-brand-light/25 flex items-center justify-center">
              <div className="w-7 h-7 bg-brand-light rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
        <span className={`text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 w-full ${selected ? 'text-brand-light' : 'text-white/80 group-hover:text-white'} transition-colors`}>
          {artist.name}
        </span>
        {artist.genres[0] && (
          <span className="text-[10px] text-text-muted -mt-1 truncate w-full">{artist.genres[0]}</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto p-6 sm:p-10 pt-14 pb-36 animate-fade-in">
      {/* Header */}
      <div className="mb-7">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
          Quem você nunca{' '}
          <span className="text-brand-light">pula?</span>
        </h2>
        <p className="text-text-muted font-medium text-sm">
          Selecione artistas. O MooSic vai aprendendo com cada escolha.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md w-full mb-8 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-text-muted group-focus-within:text-brand-light transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artistas..."
          className="w-full bg-white/[0.05] border border-white/10 text-white text-sm font-semibold rounded-full py-3 pl-11 pr-10 focus:outline-none focus:border-brand-light focus:bg-white/[0.08] transition-all placeholder:text-text-muted/50"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute inset-y-0 right-4 flex items-center text-text-muted hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
        {loadingSearch && (
          <div className="absolute inset-y-0 right-10 flex items-center">
            <div className="w-3.5 h-3.5 border-2 border-brand-light border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Selected Artists Strip */}
      {selectedArtists.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3">
            Seus artistas · {selectedArtists.length}
            {fetchingRelated && (
              <span className="ml-3 normal-case tracking-normal font-medium text-brand-light/70">
                encontrando artistas parecidos...
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedArtists.map((entity) => (
              <div
                key={`${entity.provider}-${entity.provider_id}`}
                className="flex items-center gap-2 bg-brand-light/10 border border-brand-light/25 rounded-full pl-1 pr-3 py-1"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                  {entity.cover_url ? (
                    <img src={entity.cover_url} alt={entity.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/50">
                      {entity.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-white">{entity.name}</span>
                <button onClick={() => removeSelected(entity.provider, entity.provider_id)} className="text-text-muted hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearchMode && (
        <div>
          {!loadingSearch && searchResults.length === 0 ? (
            <p className="text-text-muted text-sm py-6">Nenhum artista encontrado para "{query}".</p>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5">Resultados</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-5 mb-10">
                {searchResults.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
              </div>
            </>
          )}
        </div>
      )}

      {/* Chart Grid (hidden during search) */}
      {!isSearchMode && (
        <>
          {loadingChart ? (
            <div className="flex items-center gap-3 text-text-muted py-6">
              <div className="w-4 h-4 border-2 border-brand-light border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Carregando artistas em destaque...</span>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5">Em destaque agora</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-5 mb-10">
                {chartArtists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
              </div>
            </>
          )}

          {/* Related Artists Sections — injected dynamically as user selects */}
          {relatedSections.map((section, i) => (
            <div key={i} className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-5">
                Parecidos com{' '}
                <span className="text-brand-light/80">{section.sourceArtistName}</span>
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-5">
                {section.artists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#07080B] via-[#07080B]/80 to-transparent flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 bg-[#15161E] border border-white/[0.12] px-6 py-3.5 rounded-full shadow-2xl">
          {selectedArtists.length > 0 && (
            <>
              <span className="text-sm font-bold text-white">
                {selectedArtists.length} {selectedArtists.length === 1 ? 'artista' : 'artistas'}
              </span>
              <div className="w-px h-5 bg-white/20" />
            </>
          )}
          <button
            onClick={next}
            className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
              selectedArtists.length > 0
                ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                : 'bg-white/10 text-white/50 hover:bg-white/15'
            }`}
          >
            {selectedArtists.length > 0 ? 'Continuar' : 'Pular Etapa'}
          </button>
        </div>
      </div>
    </div>
  );
};

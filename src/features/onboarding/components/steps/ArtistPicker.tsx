import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../stores/OnboardingContext';
import { musicService } from '@/services/music/musicService';
import { Artist } from '@/types/domain/music';
import { Search, Check, AlertCircle } from 'lucide-react';

export const ArtistPicker: React.FC = () => {
  const { draft, updateDraft, next, service } = useOnboarding();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const selectedArtists = draft.favorite_artists || [];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    
    const timer = setTimeout(async () => {
      try {
        const artists = await musicService.searchArtists(query);
        setResults(artists);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 400); // Debounce de 400ms

    return () => clearTimeout(timer);
  }, [query]);

  const toggleArtist = (artist: Artist) => {
    const isSelected = selectedArtists.some(a => a.provider_id === artist.id.replace('deezer-', '').replace('itunes-artist-', ''));
    
    if (isSelected) {
      updateDraft({
        favorite_artists: selectedArtists.filter(a => a.provider_id !== artist.id.replace('deezer-', '').replace('itunes-artist-', ''))
      });
    } else {
      const entity = service.artistToTasteEntity(artist, 'declared');
      updateDraft({
        favorite_artists: [...selectedArtists, entity]
      });
    }
  };

  const isSelected = (artist: Artist) => {
    return selectedArtists.some(a => a.provider_id === artist.id.replace('deezer-', '').replace('itunes-artist-', ''));
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-5xl mx-auto p-6 sm:p-12 animate-fade-in pt-24 pb-32">
      {/* Header */}
      <div className="space-y-4 mb-10 text-center">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          Comece pelos artistas que você <span className="text-brand-light">nunca pula</span>.
        </h2>
        <p className="text-text-muted font-medium">Busque seus favoritos. Selecione quantos quiser.</p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto w-full mb-12 group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-text-muted group-focus-within:text-white transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artistas..."
          className="w-full bg-[#1A1B23]/80 border-2 border-white/10 text-white text-lg sm:text-xl font-bold rounded-full py-5 pl-16 pr-8 focus:outline-none focus:border-brand-light focus:bg-[#1A1B23] transition-all placeholder:text-text-muted/50 shadow-xl"
        />
        {loading && (
          <div className="absolute inset-y-0 right-6 flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center text-rose-500 space-y-2 py-10">
          <AlertCircle className="w-10 h-10" />
          <p className="font-bold">Houve um problema ao buscar. Tente novamente.</p>
        </div>
      )}

      {/* Empty / Initial State */}
      {!query.trim() && selectedArtists.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted text-center">
            Artistas Selecionados ({selectedArtists.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {selectedArtists.map(entity => (
              <div key={entity.provider_id} className="flex flex-col items-center space-y-3 relative group">
                <div 
                  onClick={() => updateDraft({ favorite_artists: selectedArtists.filter(a => a.provider_id !== entity.provider_id) })}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-brand-light cursor-pointer shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover:scale-105 transition-transform relative"
                >
                  <img src={entity.cover_url || 'https://cdn-images.dzcdn.net/images/artist/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/500x500.jpg'} alt={entity.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold uppercase">Remover</span>
                  </div>
                </div>
                <span className="font-bold text-center text-sm truncate w-full">{entity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      {query.trim() && !loading && !error && results.length === 0 && (
        <div className="text-center text-text-muted py-10 font-medium">
          Nenhum artista encontrado para "{query}".
        </div>
      )}

      {query.trim() && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map(artist => {
            const selected = isSelected(artist);
            return (
              <div 
                key={artist.id} 
                onClick={() => toggleArtist(artist)}
                className="flex flex-col items-center space-y-3 cursor-pointer group"
              >
                <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden transition-all duration-300 relative ${selected ? 'border-4 border-brand-light scale-105 shadow-[0_0_30px_rgba(139,92,246,0.3)]' : 'border-2 border-transparent group-hover:border-white/20'}`}>
                  <img 
                    src={artist.avatarUrl || 'https://cdn-images.dzcdn.net/images/artist/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/500x500.jpg'} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
                  {selected && (
                    <div className="absolute inset-0 bg-brand-light/20 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-10 h-10 bg-brand-light text-white rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </div>
                <span className={`font-bold text-center text-sm truncate w-full ${selected ? 'text-brand-light' : 'text-white'}`}>
                  {artist.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 bg-[#1A1B23] border border-white/10 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md">
          <span className="text-sm font-bold text-white">
            {selectedArtists.length} {selectedArtists.length === 1 ? 'artista' : 'artistas'}
          </span>
          <div className="w-px h-6 bg-white/20"></div>
          <button
            onClick={next}
            className={`px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
              selectedArtists.length > 0 
                ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
          >
            {selectedArtists.length > 0 ? 'Continuar' : 'Pular Etapa'}
          </button>
        </div>
      </div>
    </div>
  );
};

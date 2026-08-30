import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Search, X, Check, Globe, Sparkles, Music, RefreshCw } from 'lucide-react';
import { musicService } from '@/services/music/musicService';
import { deezerMusicProvider } from '@/providers/music/deezerMusicProvider';
import { mockMusicProvider } from '@/providers/music/mockMusicProvider';
import { Track } from '@/types/domain/music';

interface ApiInspectorProps {
  onApplyTrack: (track: Track) => void;
  activeTrack: Track;
}

const QUICK_SEARCH_SUGGESTIONS = [
  'Caio Ocean',
  "Racionais MC's",
  'Sabotage',
  "BK'",
  'Djonga',
  'Criolo',
  'Matuê',
  'Daft Punk',
  'The Weeknd',
];

export const ApiInspector: React.FC<ApiInspectorProps> = ({
  onApplyTrack,
  activeTrack,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('Caio Ocean');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const start = performance.now();

    try {
      const res = await musicService.search(searchQuery);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setResults(res.tracks || []);
    } catch {
      setLatency(null);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFallback = () => {
    if (isFallbackActive) {
      musicService.setProvider(deezerMusicProvider);
      setIsFallbackActive(false);
    } else {
      musicService.setProvider(mockMusicProvider);
      setIsFallbackActive(true);
    }
    handleSearch(query);
  };

  const handleApply = (track: Track) => {
    onApplyTrack(track);
    setAppliedId(track.id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Pill Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && results.length === 0) {
            handleSearch(query);
          }
        }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-surface-elevated/90 hover:bg-surface-elevated border border-brand-purple/50 hover:border-brand-purple text-white shadow-2xl backdrop-blur-xl transition-all duration-200 active:scale-95 group"
        aria-label="Abrir Deezer Music Engine"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFallbackActive ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isFallbackActive ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        </span>
        <span className="text-xs font-semibold font-sans">
          {isFallbackActive ? 'Mock Offline' : 'Deezer 100M+ Engine'}
        </span>
        <Activity className="w-3.5 h-3.5 text-brand-purple group-hover:rotate-12 transition-transform" />
      </button>

      {/* Expanded API Inspector Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 right-0 w-[calc(100vw-32px)] sm:w-[500px] max-h-[580px] rounded-3xl bg-surface-elevated/98 border border-surface-border backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-white"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-surface-border/80 flex items-center justify-between bg-surface/60">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-purple shrink-0" />
                  <h3 className="text-sm font-bold font-sans truncate">Deezer Music Engine</h3>
                </div>
                <p className="text-[11px] text-text-muted truncate">
                  Busque qualquer música e adicione diretamente ao Hero e ao Carrossel
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-surface border border-transparent hover:border-surface-border text-text-secondary hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Provider Status & Latency */}
            <div className="px-4 sm:px-5 py-2.5 bg-surface/40 border-b border-surface-border/60 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <span>Latência:</span>
                <span className="font-mono font-bold text-white">
                  {latency !== null ? `${latency}ms` : '--'}
                </span>
                <span className="text-text-muted">•</span>
                <span>Status:</span>
                <span className="font-semibold text-brand-light">
                  {isFallbackActive ? 'Offline Fallback' : 'Deezer 100M+ Online'}
                </span>
              </div>

              <button
                onClick={toggleFallback}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-surface-border hover:border-brand-purple text-[11px] text-text-secondary hover:text-white transition-all active:scale-95"
              >
                <RefreshCw className="w-3 h-3 text-brand-purple" />
                <span>{isFallbackActive ? 'Ativar Deezer' : 'Simular Queda'}</span>
              </button>
            </div>

            {/* Search Input & Quick Tags */}
            <div className="p-3 sm:p-4 border-b border-surface-border/60 bg-surface/20 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(query);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pesquise Caio Ocean, Sabotage, BK, Matuê..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-surface-border focus:border-brand-purple text-xs text-white placeholder:text-text-muted outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-3.5 py-2 rounded-xl bg-brand-purple hover:bg-brand-hover text-white text-xs font-semibold shadow-glow disabled:opacity-50 transition-all shrink-0"
                >
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <Music className="w-2.5 h-2.5" />
                  Sugestões:
                </span>
                {QUICK_SEARCH_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      handleSearch(tag);
                    }}
                    className="px-2 py-0.5 rounded-md bg-surface/60 hover:bg-surface border border-surface-border text-[10px] text-text-secondary hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 max-h-[300px]">
              {results.length === 0 && !isSearching && (
                <div className="text-center py-8 text-xs text-text-muted">
                  Nenhuma música encontrada. Digite um termo ou clique em uma das sugestões acima.
                </div>
              )}

              {results.map((track) => {
                const isCurrentActive = activeTrack.id === track.id;
                const isJustApplied = appliedId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrentActive
                        ? 'bg-brand-purple/15 border-brand-purple/60'
                        : 'bg-surface/60 border-surface-border hover:border-text-secondary/40'
                    }`}
                  >
                    {/* Track Info with Fixed-Size Square Thumbnail */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] aspect-square rounded-xl overflow-hidden border border-surface-border shrink-0 bg-surface shadow-sm relative">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover object-center aspect-square"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5 text-left">
                        <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                        <p className="text-[11px] text-text-secondary truncate">
                          {track.artistName} • <span className="text-text-muted">{track.albumTitle}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] text-brand-light font-medium truncate">
                          <span className="truncate">{track.genre || 'Music'}</span>
                          <span>•</span>
                          <span>{track.durationFormatted || '3:45'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => handleApply(track)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
                        isJustApplied
                          ? 'bg-emerald-500 text-white'
                          : isCurrentActive
                          ? 'bg-brand-purple/30 text-brand-light border border-brand-purple/50'
                          : 'bg-surface border border-surface-border hover:border-brand-purple text-text-secondary hover:text-white'
                      }`}
                    >
                      {isJustApplied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Adicionado!</span>
                        </>
                      ) : isCurrentActive ? (
                        <>
                          <Sparkles className="w-3 h-3 text-brand-purple" />
                          <span>No Hero</span>
                        </>
                      ) : (
                        <span>Adicionar</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Tip */}
            <div className="p-2.5 bg-surface/80 border-t border-surface-border/80 text-center text-[10px] text-text-muted">
              Ao adicionar, a música entra no topo do Carrossel e é exibida no Hero, Atmosfera e Player.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

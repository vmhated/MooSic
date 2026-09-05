import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { musicService } from '@/services/music/musicService';
import { Track } from '@/types/domain/music';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import {
  Search,
  Play,
  Pause,
  Heart,
  Plus,
  Sparkles,
  Music2,
  ArrowLeft,
  Shuffle,
  BookmarkCheck,
  BookmarkPlus,
  Flame,
  Radio,
  Compass,
  Zap,
  Coffee,
  Disc,
  Sun,
  Headphones,
  Clock,
} from 'lucide-react';

export interface GenreStation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgGlow: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const GENRE_STATIONS: GenreStation[] = [
  {
    id: 'pop-viral',
    title: 'Pop & Viral',
    subtitle: 'Hits Globais & Tendências',
    description: 'As melodias mais contagiantes, vocais de destaque e os maiores sucessos do pop nacional e internacional.',
    color: 'from-pink-600 via-rose-600 to-rose-800',
    bgGlow: 'rgba(244, 63, 94, 0.25)',
    query: 'Dua Lipa The Weeknd Pop Hits',
    icon: Flame,
    accentColor: '#F43F5E',
  },
  {
    id: 'hiphop-trap',
    title: 'Hip-Hop & Trap',
    subtitle: 'Graves Pesados & Rimas Afiadas',
    description: 'O melhor do trap nacional e hip-hop global: graves 808 marcantes, flow refinado e produções de peso.',
    color: 'from-amber-600 via-orange-600 to-red-800',
    bgGlow: 'rgba(234, 88, 12, 0.25)',
    query: 'Matue BK Trap Brasil',
    icon: Radio,
    accentColor: '#EA580C',
  },
  {
    id: 'indie-alt',
    title: 'Indie & Alternativo',
    subtitle: 'Guitarras Espaciais & Melodias Nostálgicas',
    description: 'Do indie rock psicodélico ao dream pop contemporâneo, perfeito para momentos de foco e introspecção.',
    color: 'from-purple-600 via-indigo-600 to-blue-900',
    bgGlow: 'rgba(147, 51, 234, 0.25)',
    query: 'Arctic Monkeys Tame Impala Indie',
    icon: Compass,
    accentColor: '#9333EA',
  },
  {
    id: 'electro-house',
    title: 'Eletrônica & House',
    subtitle: 'Sintetizadores Hipnóticos & Club Culture',
    description: 'De deep house a tech house e synthwave. Frequências ideais para elevar a energia de qualquer sessão.',
    color: 'from-cyan-600 via-blue-600 to-violet-900',
    bgGlow: 'rgba(6, 182, 212, 0.25)',
    query: 'Daft Punk Rufus Du Sol Electronic',
    icon: Zap,
    accentColor: '#06B6D4',
  },
  {
    id: 'chill-lofi',
    title: 'Chill & Lo-Fi',
    subtitle: 'Batidas Orgânicas para Estudo & Relaxamento',
    description: 'Ruídos de vinil aconchegantes, acordes de jazz suaves e melodias calmas para respirar e desacelerar.',
    color: 'from-emerald-600 via-teal-600 to-cyan-900',
    bgGlow: 'rgba(16, 185, 129, 0.25)',
    query: 'Lofi Chill Beats Study',
    icon: Coffee,
    accentColor: '#10B981',
  },
  {
    id: 'rock',
    title: 'Rock Clássico & Moderno',
    subtitle: 'Riffs Eternos & Energia Pura',
    description: 'Do rock clássico dos anos 70 e 80 aos hinos do grunge e indie rock moderno dos anos 2000.',
    color: 'from-red-600 via-rose-800 to-zinc-950',
    bgGlow: 'rgba(225, 29, 72, 0.25)',
    query: 'Queen Linkin Park Rock Classic',
    icon: Disc,
    accentColor: '#E11D48',
  },
  {
    id: 'mpb',
    title: 'MPB & Brasilidades',
    subtitle: 'Poesia, Ritmo & Raízes Brasileiras',
    description: 'Harmonias de bossa nova, samba-rock e a nova música popular brasileira cheia de alma e identidade.',
    color: 'from-amber-500 via-emerald-600 to-teal-900',
    bgGlow: 'rgba(245, 158, 11, 0.25)',
    query: 'Caetano Veloso Gilberto Gil Liniker MPB',
    icon: Sun,
    accentColor: '#F59E0B',
  },
  {
    id: 'rnb-soul',
    title: 'R&B & Neo-Soul',
    subtitle: 'Groove Aveludado & Vocais Apaixonantes',
    description: 'Linhas de baixo suaves, sintetizadores calorosos e as vozes mais expressivas do R&B atual.',
    color: 'from-fuchsia-600 via-purple-700 to-amber-900',
    bgGlow: 'rgba(192, 38, 211, 0.25)',
    query: 'SZA Frank Ocean Daniel Caesar RnB',
    icon: Headphones,
    accentColor: '#C026D3',
  },
];

const QUICK_SEARCH_CHIPS = [
  { name: 'Caio Ocean', query: 'Caio Ocean' },
  { name: 'Matuê', query: 'Matue' },
  { name: 'BK\'', query: 'BK' },
  { name: 'The Weeknd', query: 'The Weeknd' },
  { name: 'Daft Punk', query: 'Daft Punk' },
  { name: 'Lo-Fi Chill', query: 'Lo-Fi Chill' },
];

interface SearchPageProps {
  initialQuery?: string;
  onQueryChange?: (q: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onQueryChange,
}) => {
  const { setQueue, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylists();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado para Playlist do Gênero Personalizada
  const [selectedGenre, setSelectedGenre] = useState<GenreStation | null>(null);
  const [genreTracks, setGenreTracks] = useState<Track[]>([]);
  const [genreLoading, setGenreLoading] = useState(false);
  const [isSavedPlaylist, setIsSavedPlaylist] = useState(false);

  // Cache em memória para evitar refetching repetitivo e garantir navegação instantânea (0ms)
  const genreCache = useRef<Record<string, Track[]>>({});

  // Sincroniza com query vinda da Topbar
  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== query) {
      setQuery(initialQuery);
      if (initialQuery.trim()) {
        setSelectedGenre(null);
      }
    }
  }, [initialQuery]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSelectedGenre(null);
    }
    if (onQueryChange) {
      onQueryChange(val);
    }
  };

  // Carrega busca geral quando houver query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await musicService.search(query);
        setResults(res.tracks);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Carrega ou recupera do cache a playlist personalizada do gênero
  const handleOpenGenrePlaylist = async (genre: GenreStation) => {
    setSelectedGenre(genre);
    setQuery('');
    if (onQueryChange) onQueryChange('');

    // Se já estiver em cache, carrega instantaneamente
    if (genreCache.current[genre.id] && genreCache.current[genre.id].length > 0) {
      setGenreTracks(genreCache.current[genre.id]);
      setGenreLoading(false);
      return;
    }

    setGenreLoading(true);
    try {
      const res = await musicService.search(genre.query);
      const tracks = res.tracks && res.tracks.length > 0 ? res.tracks : [];
      genreCache.current[genre.id] = tracks;
      setGenreTracks(tracks);
    } catch {
      setGenreTracks([]);
    } finally {
      setGenreLoading(false);
    }
  };

  const handlePlayAllGenre = () => {
    if (genreTracks.length > 0) {
      setQueue(genreTracks, 0);
    }
  };

  const handleShuffleGenre = () => {
    if (genreTracks.length > 0) {
      const shuffled = [...genreTracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled, 0);
    }
  };

  const handleSaveGenrePlaylist = () => {
    // Adiciona as faixas à lista de curtidas
    genreTracks.forEach((track) => {
      if (!isLiked(track.id)) {
        toggleLike(track.id);
      }
    });
    setIsSavedPlaylist(true);
    setTimeout(() => setIsSavedPlaylist(false), 3000);
  };

  return (
    <div className="space-y-6 select-none max-w-6xl pb-12">
      {/* Campo de Busca Principal da Página */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Explorar & Buscar
        </h1>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light" />
          <input
            type="text"
            placeholder="Busque por faixas, artistas, álbuns ou frequências..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/10 focus:border-brand-purple rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-text-muted outline-none transition-all focus:ring-2 focus:ring-brand-purple/20 shadow-inner"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-white px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Chips de Categorias Populares */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-text-muted mr-1 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            Sugestões Rápidas:
          </span>
          {QUICK_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip.name}
              onClick={() => handleQueryChange(chip.query)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-brand-purple/40 text-text-secondary hover:text-white transition-all whitespace-nowrap"
            >
              {chip.name}
            </button>
          ))}
        </div>
      </div>

      {/* ================= ESTADO 1: RESULTADOS DA BUSCA EM TEMPO REAL ================= */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-text-muted">Buscando em múltiplos catálogos federados...</p>
        </div>
      ) : query && results.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
              <span>Resultados para "{query}" ({results.length})</span>
              <span className="text-[10px] font-bold text-brand-light bg-brand-purple/15 px-2 py-0.5 rounded-full border border-brand-purple/20">
                Catálogo Global Ativo
              </span>
            </h2>
          </div>

          <div className="space-y-1.5">
            {results.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const liked = isLiked(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => setQueue(results, idx)}
                  className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-brand-purple/15 border-brand-purple/30 text-brand-light'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="w-5 text-center text-xs font-mono text-text-muted group-hover:hidden">
                      {idx + 1}
                    </span>
                    <button className="w-5 hidden group-hover:flex items-center justify-center text-white">
                      <Play className="w-3.5 h-3.5 fill-current text-brand-light" />
                    </button>

                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover shadow flex-shrink-0"
                    />

                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-brand-light transition-colors">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">{track.artistName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddToPlaylistModal(track);
                      }}
                      className="p-1.5 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Adicionar à Playlist"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors ${
                        liked ? 'text-pink-500' : 'text-text-muted hover:text-white'
                      }`}
                      aria-label="Curtir"
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    </button>

                    <span className="text-xs text-text-muted font-mono hidden sm:inline-block w-10 text-right">
                      {formatSecondsToTime(track.durationSeconds || 30)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : query && !loading && results.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-sm font-semibold text-white">Nenhum resultado encontrado para "{query}"</p>
          <p className="text-xs text-text-muted">Tente buscar com termos mais gerais ou pelo nome do artista.</p>
        </div>
      ) : selectedGenre ? (
        /* ================= ESTADO 2: PLAYLIST PERSONALIZADA DO GÊNERO SELECIONADO ================= */
        <section className="space-y-6">
          {/* Barra Superior de Navegação & Seletor de Outros Gêneros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
            <button
              onClick={() => setSelectedGenre(null)}
              className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors group py-1"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar para todas as Frequências</span>
            </button>

            {/* Carrossel de Pílulas dos Outros Gêneros */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {GENRE_STATIONS.map((station) => {
                const isCurrent = station.id === selectedGenre.id;
                return (
                  <button
                    key={station.id}
                    onClick={() => handleOpenGenrePlaylist(station)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isCurrent
                        ? 'bg-white text-black shadow-md'
                        : 'bg-white/[0.05] hover:bg-white/10 text-text-secondary hover:text-white border border-white/10'
                    }`}
                  >
                    {station.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hero Banner da Playlist Personalizada */}
          <div
            className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${selectedGenre.color} border border-white/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-end gap-6`}
            style={{
              boxShadow: `0 20px 50px -10px ${selectedGenre.bgGlow}`,
            }}
          >
            {/* Ícone / Capa da Playlist */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              <selectedGenre.icon className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
            </div>

            {/* Metadados e Ações */}
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 text-white/90 px-3 py-1 rounded-full border border-white/15">
                  Playlist Personalizada MooSic
                </span>
                <span className="text-[10px] font-bold text-white/70">
                  {selectedGenre.subtitle}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {selectedGenre.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
                {selectedGenre.description}
              </p>

              <div className="pt-3 flex items-center gap-3 flex-wrap">
                <button
                  onClick={handlePlayAllGenre}
                  disabled={genreLoading || genreTracks.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-white/90 text-black font-extrabold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Tocar Mix Completo</span>
                </button>

                <button
                  onClick={handleShuffleGenre}
                  disabled={genreLoading || genreTracks.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white font-bold text-xs border border-white/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Aleatório</span>
                </button>

                <button
                  onClick={handleSaveGenrePlaylist}
                  disabled={genreLoading || genreTracks.length === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white font-bold text-xs border border-white/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {isSavedPlaylist ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Salvo na Biblioteca!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Salvar Playlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Faixas da Playlist Personalizada */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-muted border-b border-white/[0.06]">
              <div className="flex items-center gap-4">
                <span className="w-6 text-center">#</span>
                <span>Título & Artista</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="hidden sm:inline-block">Álbum</span>
                <Clock className="w-3.5 h-3.5 mr-3" />
              </div>
            </div>

            {genreLoading ? (
              /* Skeleton Shimmer Loading */
              <div className="space-y-2 py-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse flex items-center px-4 gap-4"
                  >
                    <div className="w-5 h-4 bg-white/10 rounded" />
                    <div className="w-10 h-10 bg-white/10 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="w-48 h-3.5 bg-white/10 rounded" />
                      <div className="w-32 h-2.5 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : genreTracks.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-sm font-semibold text-white">
                  Sincronizando frequências para este gênero...
                </p>
                <button
                  onClick={() => handleOpenGenrePlaylist(selectedGenre)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              genreTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const liked = isLiked(track.id);

                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => setQueue(genreTracks, idx)}
                    className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white/[0.08] border-white/25 shadow-lg'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Número da faixa ou Ícone de Play / Equalizador */}
                      <span className="w-6 text-center text-xs font-mono font-bold text-text-muted group-hover:hidden">
                        {isCurrent && isPlaying ? (
                          <span className="inline-flex gap-0.5 items-end h-3">
                            <span className="w-0.5 h-full bg-brand-light animate-bounce" />
                            <span className="w-0.5 h-2 bg-brand-light animate-bounce" style={{ animationDelay: '0.15s' }} />
                            <span className="w-0.5 h-3 bg-brand-light animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </span>
                        ) : (
                          idx + 1
                        )}
                      </span>
                      <button className="w-6 hidden group-hover:flex items-center justify-center text-white">
                        {isCurrent && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current text-brand-light" />
                        ) : (
                          <Play className="w-4 h-4 fill-current text-brand-light" />
                        )}
                      </button>

                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-11 h-11 rounded-xl object-cover shadow flex-shrink-0"
                      />

                      <div className="min-w-0 pr-4">
                        <p
                          className={`font-bold text-xs sm:text-sm truncate transition-colors ${
                            isCurrent ? 'text-brand-light' : 'text-white group-hover:text-brand-light'
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-[11px] text-text-muted truncate font-medium">
                          {track.artistName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                      <span className="text-xs text-text-muted hidden md:inline-block max-w-[140px] truncate">
                        {track.albumTitle || 'Single'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddToPlaylistModal(track);
                        }}
                        className="p-1.5 rounded-full text-text-muted hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Adicionar à Playlist"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track.id);
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          liked ? 'text-pink-500' : 'text-text-muted hover:text-white'
                        }`}
                        aria-label="Curtir"
                      >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                      </button>

                      <span className="text-xs text-text-muted font-mono w-10 text-right">
                        {formatSecondsToTime(track.durationSeconds || 30)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      ) : (
        /* ================= ESTADO 3: GRID DE FREQUÊNCIAS & GÊNEROS ================= */
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Music2 className="w-4 h-4 text-brand-purple" />
              <span>Navegar por Frequências & Gêneros</span>
            </h2>
            <span className="text-xs text-text-muted">
              Clique em qualquer quadrado para abrir a playlist do gênero
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {GENRE_STATIONS.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleOpenGenrePlaylist(cat)}
                  className={`relative h-32 rounded-3xl p-5 bg-gradient-to-br ${cat.color} overflow-hidden shadow-xl cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all flex flex-col justify-between border border-white/15 group select-none`}
                  style={{
                    boxShadow: `0 10px 25px -5px ${cat.bgGlow}`,
                  }}
                >
                  {/* Ícone de Fundo Translúcido */}
                  <IconComp className="absolute -bottom-2 -right-2 w-20 h-20 text-white/15 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />

                  <div>
                    <h3 className="font-black text-base sm:text-lg text-white tracking-tight drop-shadow-sm">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-white/75 font-medium line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                      Explorar Som
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shadow">
                      <Play className="w-3.5 h-3.5 fill-current text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};


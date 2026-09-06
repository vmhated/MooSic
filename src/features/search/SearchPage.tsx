import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { musicService } from '@/services/music/musicService';
import { Track } from '@/types/domain/music';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import { TrackRow, MusicCard } from '@/components/music';
import { PlayButton } from '@/components/ui/PlayButton';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  Sparkles,
  ArrowLeft,
  Shuffle,
  Flame,
  Radio,
  Compass,
  Zap,
  Coffee,
  Disc,
  Sun,
  Headphones,
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
    color: 'from-pink-600 via-rose-600 to-rose-900',
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
    color: 'from-amber-600 via-orange-600 to-red-900',
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
    color: 'from-purple-600 via-indigo-600 to-blue-950',
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
    color: 'from-cyan-600 via-blue-600 to-violet-950',
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
    color: 'from-emerald-600 via-teal-600 to-cyan-950',
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
    color: 'from-amber-500 via-emerald-600 to-teal-950',
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
    color: 'from-fuchsia-600 via-purple-700 to-amber-950',
    bgGlow: 'rgba(192, 38, 211, 0.25)',
    query: 'SZA Frank Ocean Daniel Caesar RnB',
    icon: Headphones,
    accentColor: '#C026D3',
  },
];

const QUICK_SEARCH_CHIPS = [
  { name: 'Frank Ocean', query: 'Frank Ocean' },
  { name: 'Matuê', query: 'Matue' },
  { name: 'The Weeknd', query: 'The Weeknd' },
  { name: 'BK\'', query: 'BK' },
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

  // Estado para Estação de Gênero Selecionada
  const [selectedGenre, setSelectedGenre] = useState<GenreStation | null>(null);
  const [genreTracks, setGenreTracks] = useState<Track[]>([]);
  const [genreLoading, setGenreLoading] = useState(false);

  // Cache em memória para estações de gênero
  const genreCache = useRef<Record<string, Track[]>>({});

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
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleOpenGenre = async (genre: GenreStation) => {
    setSelectedGenre(genre);
    setQuery('');
    if (onQueryChange) onQueryChange('');

    if (genreCache.current[genre.id]) {
      setGenreTracks(genreCache.current[genre.id]);
      return;
    }

    setGenreLoading(true);
    try {
      const res = await musicService.search(genre.query);
      genreCache.current[genre.id] = res.tracks;
      setGenreTracks(res.tracks);
    } catch {
      setGenreTracks([]);
    } finally {
      setGenreLoading(false);
    }
  };

  const handlePlayQueue = (tracksList: Track[], index: number, title?: string) => {
    setQueue(tracksList, index, {
      type: 'search',
      title: title || 'Busca MooSic',
      position: index,
    });
  };

  const bestMatch = results[0];
  const sideResults = results.slice(1, 6);
  const moreResults = results.slice(6);

  // ================= 1. VISUALIZAÇÃO DE ESTAÇÃO DE GÊNERO =================
  if (selectedGenre) {
    const Icon = selectedGenre.icon;
    const totalDuration = genreTracks.reduce((acc, t) => acc + (t.durationSeconds || 30), 0);
    const isGenreCurrent = genreTracks.some((t) => t.id === currentTrack?.id);

    return (
      <div className="space-y-8 select-none w-full max-w-[1720px] mx-auto pb-32">
        <button
          onClick={() => setSelectedGenre(null)}
          className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Explorar</span>
        </button>

        {/* Hero da Estação */}
        <div
          className={`relative rounded-4xl p-6 sm:p-10 bg-gradient-to-br ${selectedGenre.color} border border-white/20 shadow-2xl overflow-hidden`}
        >
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-black/40 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                <Icon className="w-3.5 h-3.5" />
                <span>Estação Sonora</span>
              </span>
              <span className="text-xs text-white/80 font-mono">
                {genreTracks.length} faixas selecionadas
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {selectedGenre.title}
            </h1>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
              {selectedGenre.description}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => handlePlayQueue(genreTracks, 0, selectedGenre.title)}
                className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <PlayButton isPlaying={isGenreCurrent && isPlaying} size="sm" variant="white" />
                <span>Tocar Estação</span>
              </button>

              <button
                onClick={() => {
                  const shuffled = [...genreTracks].sort(() => Math.random() - 0.5);
                  handlePlayQueue(shuffled, 0, `Mix: ${selectedGenre.title}`);
                }}
                className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 transition-all hover:scale-105"
                title="Tocar em ordem aleatória"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Faixas da Estação */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted font-mono">
            <span>FAIXAS CURADAS</span>
            <span>{formatSecondsToTime(totalDuration)} DURAÇÃO TOTAL</span>
          </div>

          {genreLoading ? (
            <LoadingState type="tracklist" count={6} />
          ) : (
            <div className="space-y-1.5">
              {genreTracks.map((track, idx) => (
                <TrackRow
                  key={`genre-track-${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  isCurrent={currentTrack?.id === track.id}
                  isPlaying={isPlaying && currentTrack?.id === track.id}
                  isLiked={isLiked(track.id)}
                  onPlay={() => handlePlayQueue(genreTracks, idx, selectedGenre.title)}
                  onToggleLike={() => toggleLike(track.id)}
                  onAddToPlaylist={() => openAddToPlaylistModal(track)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // ================= 2. RESULTADOS DE BUSCA ATIVOS =================
  if (query.trim()) {
    return (
      <div className="space-y-8 select-none w-full max-w-[1720px] mx-auto pb-32">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Resultados para <span className="text-brand-light font-extrabold">"{query}"</span>
          </h1>
          {results.length > 0 && (
            <span className="text-xs text-text-muted font-mono">{results.length} faixas encontradas</span>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <LoadingState type="hero" />
            <LoadingState type="tracklist" count={4} />
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title="Nenhum som encontrado"
            description={`Não encontramos faixas correspondentes a "${query}". Tente buscar pelo nome exato da música ou artista.`}
            actionLabel="Limpar busca"
            onAction={() => handleQueryChange('')}
          />
        ) : (
          <div className="space-y-10">
            {/* Split: Melhor Correspondência à Esquerda + Top Faixas à Direita */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Melhor Correspondência */}
              {bestMatch && (
                <div className="col-span-1 lg:col-span-5 space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-text-muted">
                    Melhor Correspondência
                  </span>
                  <div
                    onClick={() => handlePlayQueue(results, 0, `Busca: ${query}`)}
                    className="p-5 sm:p-6 rounded-3xl bg-[#0D0E14] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group shadow-card flex flex-col justify-between space-y-4"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg border border-white/10">
                      <img
                        src={bestMatch.coverUrl}
                        alt={bestMatch.title}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight group-hover:text-brand-light transition-colors truncate">
                        {bestMatch.title}
                      </h3>
                      <p className="text-sm font-bold text-text-muted mt-0.5">{bestMatch.artistName}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="brand">Música</Badge>
                        <Badge variant="hires">Hi-Res</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top 5 Faixas */}
              <div className="col-span-1 lg:col-span-7 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-text-muted">
                  Faixas Mais Relevantes
                </span>
                <div className="space-y-1.5 p-3 rounded-3xl bg-[#0D0E14] border border-white/[0.06]">
                  {sideResults.map((track, idx) => {
                    const realIndex = idx + 1;
                    return (
                      <TrackRow
                        key={`search-side-${track.id}-${idx}`}
                        track={track}
                        index={idx}
                        isCurrent={currentTrack?.id === track.id}
                        isPlaying={isPlaying && currentTrack?.id === track.id}
                        isLiked={isLiked(track.id)}
                        onPlay={() => handlePlayQueue(results, realIndex, `Busca: ${query}`)}
                        onToggleLike={() => toggleLike(track.id)}
                        onAddToPlaylist={() => openAddToPlaylistModal(track)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mais Músicas em Grade Editorial */}
            {moreResults.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Outras Músicas Relacionadas
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                  {moreResults.map((track, idx) => {
                    const realIndex = idx + 6;
                    return (
                      <MusicCard
                        key={`search-more-${track.id}-${idx}`}
                        track={track}
                        isCurrent={currentTrack?.id === track.id}
                        isPlaying={isPlaying && currentTrack?.id === track.id}
                        isLiked={isLiked(track.id)}
                        onPlay={() => handlePlayQueue(results, realIndex, `Busca: ${query}`)}
                        onToggleLike={() => toggleLike(track.id)}
                        onAddToPlaylist={() => openAddToPlaylistModal(track)}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    );
  }

  // ================= 3. ESTADO INICIAL DE EXPLORAÇÃO (HUB DE ESTAÇÕES) =================
  return (
    <div className="space-y-10 select-none w-full max-w-[1720px] mx-auto pb-32">
      {/* Topo do Explorar */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-light" />
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-light">
              Exploração & Descoberta
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Navegue por Estações & Frequências
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-medium max-w-xl">
            Descubra novos universos sonoros organizados por ambiência, energia acústica e gêneros atemporais.
          </p>
        </div>

        {/* Chips de Acesso Rápido */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-text-muted font-bold flex-shrink-0">Em alta:</span>
          {QUICK_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip.name}
              onClick={() => handleQueryChange(chip.query)}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 border border-white/[0.08] text-xs font-semibold text-text-secondary hover:text-white transition-all flex-shrink-0 active:scale-95"
            >
              {chip.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grade de 8 Estações Temáticas de Alta Fidelidade */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-text-muted">
          Estações Sonoras Curadas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {GENRE_STATIONS.map((station) => {
            const Icon = station.icon;
            return (
              <div
                key={station.id}
                onClick={() => handleOpenGenre(station)}
                className={`group relative p-5 sm:p-6 rounded-3xl bg-gradient-to-br ${station.color} border border-white/15 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[170px] hover:scale-[1.02] hover:-translate-y-1`}
              >
                <div className="relative z-10 space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-white mb-3 backdrop-blur-md">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight leading-snug">
                    {station.title}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    {station.subtitle}
                  </p>
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] font-bold text-white/90">
                  <span className="group-hover:translate-x-1 transition-transform">Ouvir estação →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

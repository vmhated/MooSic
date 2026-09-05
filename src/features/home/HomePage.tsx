import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { musicService } from '@/services/music/musicService';
import { Track } from '@/types/domain/music';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import {
  Play,
  Pause,
  Heart,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Radio,
  Coffee,
} from 'lucide-react';

interface CarouselProps {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  tracks: Track[];
  onPlay: (tracks: Track[], index: number) => void;
  currentTrackId?: string;
  isPlaying?: boolean;
  onToggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  onAddToPlaylist: (track: Track) => void;
}

const MusicCarousel: React.FC<CarouselProps> = ({
  title,
  subtitle,
  icon: Icon,
  tracks,
  onPlay,
  currentTrackId,
  isPlaying,
  onToggleLike,
  isLiked,
  onAddToPlaylist,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (tracks.length === 0) return null;

  return (
    <section className="space-y-3.5 select-none relative group/carousel">
      {/* Header da Seção com Botões de Navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center text-brand-light shadow-sm">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h2>
            {subtitle && <p className="text-[11px] text-text-muted">{subtitle}</p>}
          </div>
        </div>

        {/* Botões de Rolagem Horizontal */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Container de Rolagem dos Cards */}
      <div
        ref={containerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x"
      >
        {tracks.map((track, idx) => {
          const isCurrent = currentTrackId === track.id;
          const liked = isLiked(track.id);

          return (
            <div
              key={`${track.id}-${idx}`}
              onClick={() => onPlay(tracks, idx)}
              className="snap-start flex-shrink-0 w-36 sm:w-44 md:w-48 group cursor-pointer"
            >
              {/* Capa Quadrada Proporcional com Cantos Arredondados */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#12131A] border border-white/10 shadow-lg group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)] group-hover:scale-[1.03] transition-all duration-300">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />

                {/* Gradiente sutil na base da capa */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Botões Flutuantes Superiores (+ Playlist e Curtir) */}
                <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToPlaylist(track);
                    }}
                    className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow"
                    title="Adicionar à Playlist"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(track.id);
                    }}
                    className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                      liked
                        ? 'bg-black/70 text-pink-500 opacity-100'
                        : 'bg-black/60 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 hover:scale-110'
                    }`}
                    title={liked ? 'Remover dos favoritos' : 'Curtir'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Botão Play Flutuante Central no Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="w-11 h-11 rounded-full bg-white text-black shadow-2xl flex items-center justify-center transform group-hover:scale-110 active:scale-95 transition-transform">
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current text-black" />
                    ) : (
                      <Play className="w-4 h-4 fill-current text-black ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Badge de Faixa Ativa */}
                {isCurrent && isPlaying && (
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-brand-purple text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-brand-purple/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>Ouvindo</span>
                  </div>
                )}
              </div>

              {/* Informações da Faixa */}
              <div className="pt-2.5 px-0.5">
                <h3
                  className={`font-bold text-xs sm:text-sm truncate transition-colors ${
                    isCurrent ? 'text-brand-light' : 'text-white group-hover:text-brand-light'
                  }`}
                >
                  {track.title}
                </h3>
                <p className="text-[11px] text-text-muted truncate mt-0.5 font-medium">
                  {track.artistName}
                </p>
                <div className="flex items-center justify-between text-[10px] text-text-muted/70 mt-1">
                  <span className="truncate max-w-[90px]">{track.albumTitle || 'Álbum'}</span>
                  <span className="font-mono">{formatSecondsToTime(track.durationSeconds || 30)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const HomePage: React.FC = () => {
  const { setQueue, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();
  const { openAddToPlaylistModal } = usePlaylists();

  // Estados dos catálogos dos carrosséis
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [trapTracks, setTrapTracks] = useState<Track[]>([]);
  const [popTracks, setPopTracks] = useState<Track[]>([]);
  const [chillTracks, setChillTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  // Faixa em destaque no Spotlight Banner do topo
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadAllHomeFeeds() {
      try {
        const [featuredRes, trapRes, popRes, chillRes] = await Promise.allSettled([
          musicService.getFeaturedTracks(),
          musicService.search('Matue BK Djonga Trap Brasil'),
          musicService.search('The Weeknd Dua Lipa Pop Hits'),
          musicService.search('Lofi Chill Beats Study Synthwave'),
        ]);

        if (mounted) {
          if (featuredRes.status === 'fulfilled') setFeaturedTracks(featuredRes.value);
          if (trapRes.status === 'fulfilled') setTrapTracks(trapRes.value.tracks);
          if (popRes.status === 'fulfilled') setPopTracks(popRes.value.tracks);
          if (chillRes.status === 'fulfilled') setChillTracks(chillRes.value.tracks);
        }
      } catch {
        // Fallback gracioso
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAllHomeFeeds();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePlayQueue = (tracksList: Track[], index: number) => {
    setQueue(tracksList, index);
  };

  // Faixa ativa para o Spotlight
  const pool = featuredTracks.length > 0 ? featuredTracks : trapTracks;
  const spotlightTrack: Track | undefined = pool[spotlightIndex] || pool[0];

  const handleNextSpotlight = () => {
    if (pool.length > 0) {
      setSpotlightIndex((prev) => (prev + 1) % pool.length);
    }
  };

  const handlePrevSpotlight = () => {
    if (pool.length > 0) {
      setSpotlightIndex((prev) => (prev - 1 + pool.length) % pool.length);
    }
  };

  const isSpotlightCurrent = spotlightTrack && currentTrack?.id === spotlightTrack.id;

  return (
    <div className="space-y-10 select-none max-w-7xl pb-20">
      {/* ================= 1. SPOTLIGHT BILLBOARD EM DESTAQUE (TOPO) ================= */}
      {spotlightTrack && (
        <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#0C0D13]">
          {/* Fundo com Imagem Desfocada Atmosférica */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-3xl scale-125 pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${spotlightTrack.coverUrl})` }}
          />

          {/* Gradiente Escuro de Fusão Visual */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/85 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8">
            {/* Informações da Faixa em Destaque */}
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-brand-purple text-white px-3 py-1 rounded-full shadow-md">
                  Spotlight MooSic
                </span>
                <span className="text-[11px] font-bold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  {spotlightTrack.genre || 'Destaque Oficial'}
                </span>
                <span className="text-[11px] font-mono text-white/60">
                  Master Hi-Res • 24b / 96kHz
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
                  {spotlightTrack.title}
                </h1>
                <p className="text-base sm:text-xl font-bold text-brand-light mt-2 tracking-wide">
                  {spotlightTrack.artistName}
                </p>
                <p className="text-xs sm:text-sm text-text-muted mt-1">
                  Álbum: {spotlightTrack.albumTitle || 'Lançamento Oficial'} • Duração: {formatSecondsToTime(spotlightTrack.durationSeconds || 30)}
                </p>
              </div>

              {/* Ações do Spotlight */}
              <div className="pt-2 flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <button
                  onClick={() => handlePlayQueue(pool, spotlightIndex)}
                  className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-white hover:bg-white/90 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  {isSpotlightCurrent && isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Tocar Agora</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => openAddToPlaylistModal(spotlightTrack)}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
                >
                  <Plus className="w-4 h-4 text-brand-light" />
                  <span>Adicionar à Playlist</span>
                </button>

                <button
                  onClick={() => toggleLike(spotlightTrack.id)}
                  className={`p-3 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                    isLiked(spotlightTrack.id)
                      ? 'bg-pink-500/20 text-pink-500 border-pink-500/30'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                  aria-label="Curtir faixa em destaque"
                >
                  <Heart className={`w-4 h-4 ${isLiked(spotlightTrack.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Capa com Proporção Ampla e Iluminação Estilizada */}
            <div className="relative flex-shrink-0 group">
              <div
                className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/20 transition-transform duration-500 group-hover:scale-102"
                style={{
                  boxShadow: `0 20px 50px -10px ${spotlightTrack.accent || 'rgba(139, 92, 246, 0.4)'}`,
                }}
              >
                <img
                  src={spotlightTrack.coverUrl}
                  alt={spotlightTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Botões de Próximo/Anterior no Spotlight */}
              <div className="absolute -bottom-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/15 p-1 rounded-full shadow-lg">
                <button
                  onClick={handlePrevSpotlight}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Faixa anterior em destaque"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-white px-1">
                  {spotlightIndex + 1}/{pool.length}
                </span>
                <button
                  onClick={handleNextSpotlight}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Próxima faixa em destaque"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. CARROSSÉIS HORIZONTAIS DE MÚSICAS ================= */}
      {loading ? (
        <div className="space-y-8 py-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-48 bg-white/10 rounded-lg animate-pulse" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-44 h-56 bg-white/[0.03] rounded-2xl animate-pulse flex-shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Carrossel 1: Destaques da Semana */}
          <MusicCarousel
            title="Lançamentos & Destaques da Semana"
            subtitle="As músicas mais tocadas e recomendadas para a sua frequência sonora"
            icon={Sparkles}
            tracks={featuredTracks}
            onPlay={handlePlayQueue}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            onToggleLike={toggleLike}
            isLiked={isLiked}
            onAddToPlaylist={openAddToPlaylistModal}
          />

          {/* Carrossel 2: Trap & Hip-Hop Brasil */}
          <MusicCarousel
            title="Trap & Rimas Urbanas"
            subtitle="Graves 808 pesados, lírica afiada e o melhor do hip-hop nacional"
            icon={Flame}
            tracks={trapTracks}
            onPlay={handlePlayQueue}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            onToggleLike={toggleLike}
            isLiked={isLiked}
            onAddToPlaylist={openAddToPlaylistModal}
          />

          {/* Carrossel 3: Pop & Tendências Globais */}
          <MusicCarousel
            title="Pop & Sucessos Globais"
            subtitle="Batidas contagiantes e os maiores hits das paradas internacionais"
            icon={Radio}
            tracks={popTracks}
            onPlay={handlePlayQueue}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            onToggleLike={toggleLike}
            isLiked={isLiked}
            onAddToPlaylist={openAddToPlaylistModal}
          />

          {/* Carrossel 4: Sessão Lo-Fi & Foco Cósmico */}
          <MusicCarousel
            title="Sessão Lo-Fi & Foco Cósmico"
            subtitle="Texturas orgânicas e sintetizadores suaves para estudo e desaceleração"
            icon={Coffee}
            tracks={chillTracks}
            onPlay={handlePlayQueue}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
            onToggleLike={toggleLike}
            isLiked={isLiked}
            onAddToPlaylist={openAddToPlaylistModal}
          />
        </div>
      )}
    </div>
  );
};

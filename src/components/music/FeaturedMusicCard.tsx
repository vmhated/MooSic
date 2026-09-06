import { Track } from '@/types/domain/music';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import { Play, Pause, Heart, Plus, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface FeaturedMusicCardProps {
  track: Track;
  isCurrent?: boolean;
  isPlaying?: boolean;
  isLiked?: boolean;
  onPlay: () => void;
  onToggleLike?: () => void;
  onAddToPlaylist?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalCount?: number;
  className?: string;
}

export function FeaturedMusicCard({
  track,
  isCurrent = false,
  isPlaying = false,
  isLiked = false,
  onPlay,
  onToggleLike,
  onAddToPlaylist,
  onNext,
  onPrev,
  currentIndex = 0,
  totalCount = 1,
  className = '',
}: FeaturedMusicCardProps) {
  const isFeaturedPlaying = isCurrent && isPlaying;
  const accent = track.accent || '#8B5CF6';

  return (
    <div
      className={`relative rounded-4xl overflow-hidden border border-white/[0.12] bg-[#0A0B10] shadow-2xl select-none group/featured ${className}`}
    >
      {/* 1. Atmosfera Dinâmica Suave de Fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-3xl scale-125 pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: `url(${track.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-transparent to-transparent pointer-events-none" />

      {/* 2. Conteúdo em Grid Assimétrico */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col-reverse md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Lado Esquerdo: Tipografia e Ações */}
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <Badge variant="brand" icon={<Sparkles className="w-3 h-3 text-brand-light" />}>
              Destaque MooSic
            </Badge>
            {track.genre && (
              <Badge variant="neutral">
                {track.genre}
              </Badge>
            )}
            <Badge variant="hires">
              Hi-Res • 24b / 96kHz
            </Badge>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {track.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-brand-light tracking-wide">
              {track.artistName}
            </p>
            <p className="text-xs sm:text-sm text-text-muted">
              {track.albumTitle || 'Lançamento Oficial'} • {formatSecondsToTime(track.durationSeconds || 30)}
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <button
              onClick={onPlay}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white hover:bg-neutral-100 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {isFeaturedPlaying ? (
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

            {onAddToPlaylist && (
              <button
                onClick={onAddToPlaylist}
                className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs border border-white/15 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
              >
                <Plus className="w-4 h-4 text-brand-light" />
                <span>Salvar na Playlist</span>
              </button>
            )}

            {onToggleLike && (
              <button
                onClick={onToggleLike}
                className={`p-3 sm:p-3.5 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                  isLiked
                    ? 'bg-pink-500/20 text-pink-500 border-pink-500/40'
                    : 'bg-white/[0.08] text-white border-white/15 hover:bg-white/[0.15]'
                }`}
                aria-label="Curtir faixa"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Lado Direito: Capa com Sombra Atmosférica e Navegador */}
        <div className="relative flex-shrink-0 group">
          <div
            className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-transform duration-500 group-hover:scale-[1.02]"
            style={{
              boxShadow: `0 20px 50px -10px ${accent}`,
            }}
          >
            <img
              src={track.coverUrl}
              alt={track.title}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navegador de Spotlight (Anterior / Próximo) */}
          {(onNext || onPrev) && totalCount > 1 && (
            <div className="absolute -bottom-3 right-3 flex items-center gap-1.5 bg-[#0D0E14]/90 backdrop-blur-md border border-white/15 p-1 rounded-full shadow-lg">
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Destaque anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-[10px] font-mono font-bold text-white px-1">
                {currentIndex + 1}/{totalCount}
              </span>
              {onNext && (
                <button
                  onClick={onNext}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Próximo destaque"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

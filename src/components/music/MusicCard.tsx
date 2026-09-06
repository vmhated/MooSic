import { Track } from '@/types/domain/music';
import { Heart, Plus } from 'lucide-react';
import { PlayButton } from '@/components/ui/PlayButton';

export interface MusicCardProps {
  track: Track;
  isCurrent?: boolean;
  isPlaying?: boolean;
  isLiked?: boolean;
  onPlay: () => void;
  onToggleLike?: () => void;
  onAddToPlaylist?: () => void;
  onArtistClick?: () => void;
  className?: string;
}

export function MusicCard({
  track,
  isCurrent = false,
  isPlaying = false,
  isLiked = false,
  onPlay,
  onToggleLike,
  onAddToPlaylist,
  onArtistClick,
  className = '',
}: MusicCardProps) {
  const isCardPlaying = isCurrent && isPlaying;
  const accent = track.accent || '#8B5CF6';

  return (
    <div
      onClick={onPlay}
      className={`group relative p-3 sm:p-3.5 rounded-3xl bg-[#0D0E14] hover:bg-[#141520] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 cursor-pointer select-none flex flex-col justify-between hover:shadow-card hover:-translate-y-1 ${className}`}
    >
      {/* 1. Capa Quadrada Proporcional */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#101118] border border-white/[0.08] shadow-md">
        <img
          src={track.coverUrl}
          alt={track.title}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradiente sutil na base da arte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

        {/* Ações Flutuantes no Topo Direito */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          {onAddToPlaylist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToPlaylist();
              }}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-sm"
              title="Adicionar à playlist"
              aria-label="Adicionar à playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}

          {onToggleLike && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike();
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isLiked
                  ? 'bg-black/70 text-pink-500 opacity-100'
                  : 'bg-black/60 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 hover:scale-110'
              }`}
              title={isLiked ? 'Remover dos favoritos' : 'Curtir'}
              aria-label="Curtir"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Botão Play Flutuante no Canto Inferior Direito no Hover */}
        <div
          className={`absolute bottom-2.5 right-2.5 transition-all duration-300 ${
            isCardPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          <PlayButton
            isPlaying={isCardPlaying}
            size="md"
            variant="white"
            accent={accent}
            glow
          />
        </div>

        {/* Badge "Ouvindo" se for a faixa ativa */}
        {isCardPlaying && (
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-brand-purple text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>Ouvindo</span>
          </div>
        )}
      </div>

      {/* 2. Informações Editoriais da Faixa */}
      <div className="pt-3 px-1">
        <h3
          className={`font-bold text-xs sm:text-sm truncate transition-colors ${
            isCurrent ? 'text-brand-light' : 'text-white group-hover:text-brand-light'
          }`}
        >
          {track.title}
        </h3>

        <p
          onClick={(e) => {
            if (onArtistClick) {
              e.stopPropagation();
              onArtistClick();
            }
          }}
          className={`text-[11px] sm:text-xs text-text-muted truncate mt-0.5 font-medium ${
            onArtistClick ? 'hover:text-text-secondary hover:underline cursor-pointer' : ''
          }`}
        >
          {track.artistName}
        </p>

        {track.genre && (
          <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted font-mono">
            <span className="truncate max-w-[120px] bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.04]">
              {track.genre}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

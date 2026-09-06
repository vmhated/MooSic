import { useState } from 'react';
import { Track } from '@/types/domain/music';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import { Play, Pause, Heart, Plus, Trash2, ListPlus, CornerDownRight } from 'lucide-react';
import { Artwork } from '@/components/ui/Artwork';

export interface TrackRowProps {
  track: Track;
  index?: number;
  isCurrent?: boolean;
  isPlaying?: boolean;
  isLiked?: boolean;
  onPlay: () => void;
  onToggleLike?: () => void;
  onAddToPlaylist?: () => void;
  onPlayNext?: () => void;
  onAddToQueue?: () => void;
  onRemove?: () => void;
  onArtistClick?: () => void;
  showCover?: boolean;
  showAlbum?: boolean;
  showIndex?: boolean;
  showDuration?: boolean;
  compact?: boolean;
  className?: string;
}

export function TrackRow({
  track,
  index,
  isCurrent = false,
  isPlaying = false,
  isLiked = false,
  onPlay,
  onToggleLike,
  onAddToPlaylist,
  onPlayNext,
  onAddToQueue,
  onRemove,
  onArtistClick,
  showCover = true,
  showAlbum = true,
  showIndex = true,
  showDuration = true,
  compact = false,
  className = '',
}: TrackRowProps) {
  const isRowPlaying = isCurrent && isPlaying;
  const [showQueueMenu, setShowQueueMenu] = useState(false);

  return (
    <div
      onClick={onPlay}
      className={`group relative flex items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-150 cursor-pointer select-none ${
        isCurrent
          ? 'bg-brand-purple/15 border border-brand-purple/30 text-white shadow-sm'
          : 'hover:bg-white/[0.04] text-text-secondary hover:text-white border border-transparent hover:border-white/[0.05]'
      } ${compact ? 'py-1.5 px-2.5' : ''} ${className}`}
    >
      {/* 1. Lado Esquerdo: Index / Play Icon + Capa + Informações */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
        {/* Número da Faixa / Indicador de Play */}
        {showIndex && (
          <div className="w-6 sm:w-7 text-center flex-shrink-0 flex items-center justify-center">
            {isRowPlaying ? (
              // Micro-equalizador sonoro animado
              <div className="flex items-end justify-center gap-[2.5px] h-3.5 w-4">
                <span className="w-[3px] bg-brand-light rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                <span className="w-[3px] bg-brand-light rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2/3" />
                <span className="w-[3px] bg-brand-light rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-4/5" />
              </div>
            ) : (
              <>
                <span
                  className={`text-xs font-mono font-bold group-hover:hidden ${
                    isCurrent ? 'text-brand-light' : 'text-text-muted'
                  }`}
                >
                  {index !== undefined ? index + 1 : ''}
                </span>
                <Play className="w-3.5 h-3.5 fill-current text-white hidden group-hover:block ml-0.5" />
              </>
            )}
          </div>
        )}

        {/* Capa da Música */}
        {showCover && (
          <div className="relative flex-shrink-0">
            <Artwork
              src={track.coverUrl}
              alt={track.title}
              size={compact ? 'xs' : 'sm'}
              rounded="lg"
            />
            {isRowPlaying && (
              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                <Pause className="w-3.5 h-3.5 text-white fill-current" />
              </div>
            )}
          </div>
        )}

        {/* Título e Artista */}
        <div className="min-w-0 flex-1 pr-2">
          <p
            className={`text-xs sm:text-sm font-bold truncate transition-colors ${
              isCurrent ? 'text-brand-light' : 'text-white group-hover:text-white'
            }`}
          >
            {track.title}
          </p>
          <p
            onClick={(e) => {
              if (onArtistClick) {
                e.stopPropagation();
                onArtistClick();
              }
            }}
            className={`text-[11px] sm:text-xs text-text-muted truncate font-medium hover:underline ${
              onArtistClick ? 'cursor-pointer hover:text-text-secondary' : ''
            }`}
          >
            {track.artistName}
          </p>
        </div>
      </div>

      {/* 2. Centro / Direita: Álbum (Opcional, escondido em telas pequenas) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 px-2">
          <p className="text-xs text-text-muted truncate font-medium">
            {track.albumTitle || 'Lançamento Oficial'}
          </p>
        </div>
      )}

      {/* 3. Lado Direito: Ações Contextuais + Duração */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Botão Tocar em Seguida / Adicionar à Fila */}
        {(onPlayNext || onAddToQueue) && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onPlayNext) {
                  onPlayNext();
                } else if (onAddToQueue) {
                  onAddToQueue();
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQueueMenu((prev) => !prev);
              }}
              className="p-1.5 rounded-full text-text-muted opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all"
              title="Tocar em seguida (ou clique com botão direito para opções de fila)"
              aria-label="Opções de Fila"
            >
              <ListPlus className="w-3.5 h-3.5" />
            </button>

            {/* Menu Contextual de Fila (se acionado) */}
            {showQueueMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-8 z-30 w-44 rounded-2xl bg-[#141520] border border-white/10 p-1.5 shadow-2xl space-y-1 text-xs"
              >
                {onPlayNext && (
                  <button
                    onClick={() => {
                      onPlayNext();
                      setShowQueueMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-colors flex items-center gap-2"
                  >
                    <CornerDownRight className="w-3 h-3 text-brand-light" />
                    <span>Tocar em seguida</span>
                  </button>
                )}
                {onAddToQueue && (
                  <button
                    onClick={() => {
                      onAddToQueue();
                      setShowQueueMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-text-secondary hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ListPlus className="w-3 h-3 text-cyan-400" />
                    <span>Adicionar ao fim</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botão Curtir */}
        {onToggleLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className={`p-1.5 rounded-full transition-transform active:scale-75 ${
              isLiked
                ? 'text-pink-500 opacity-100'
                : 'text-text-muted opacity-0 group-hover:opacity-100 hover:text-white'
            }`}
            aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Botão Adicionar à Playlist */}
        {onAddToPlaylist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist();
            }}
            className="p-1.5 rounded-full text-text-muted opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
            title="Adicionar à playlist"
            aria-label="Adicionar à playlist"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Botão Remover (se estiver em uma playlist editável) */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 rounded-full text-text-muted opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity"
            title="Remover da playlist"
            aria-label="Remover da playlist"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Duração */}
        {showDuration && (
          <span className="text-[11px] sm:text-xs font-mono text-text-muted w-10 text-right tabular-nums">
            {formatSecondsToTime(track.durationSeconds || 30)}
          </span>
        )}
      </div>
    </div>
  );
}

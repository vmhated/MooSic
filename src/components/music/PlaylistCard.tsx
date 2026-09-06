import type React from 'react';
import { CustomPlaylist } from '@/types/domain/playlist';
import { PLAYLIST_THEMES } from '@/constants/playlistThemes';
import { PlayButton } from '@/components/ui/PlayButton';
import { ListMusic, Flame, Radio, Zap, Compass, Sparkles, Disc } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Radio,
  Zap,
  Compass,
  Sparkles,
  Disc,
};

export interface PlaylistCardProps {
  playlist: CustomPlaylist;
  isPlaying?: boolean;
  onPlay?: () => void;
  onClick?: () => void;
  className?: string;
}

export function PlaylistCard({
  playlist,
  isPlaying = false,
  onPlay,
  onClick,
  className = '',
}: PlaylistCardProps) {
  const theme = PLAYLIST_THEMES[playlist.themeId] || PLAYLIST_THEMES['cyberpunk-neon'];
  const IconComponent = ICON_MAP[theme.iconName] || ListMusic;
  const trackCount = playlist.tracks.length;

  return (
    <div
      onClick={onClick}
      className={`group relative p-3 sm:p-3.5 rounded-3xl bg-[#0D0E14] hover:bg-[#141520] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 cursor-pointer select-none flex flex-col justify-between hover:shadow-card hover:-translate-y-1 ${className}`}
    >
      {/* Capa com Gradiente do Tema ou Colagem das Músicas */}
      <div
        className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br ${theme.gradient} border border-white/[0.1] shadow-md flex items-center justify-center`}
      >
        {trackCount > 0 && playlist.tracks[0]?.coverUrl ? (
          <img
            src={playlist.tracks[0].coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/80 p-4">
            <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 mb-2 stroke-[1.5]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

        {/* Badge do Tema */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-wider text-white">
          {theme.name}
        </div>

        {/* Botão Play no Canto Inferior Direito no Hover */}
        {onPlay && trackCount > 0 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className={`absolute bottom-2.5 right-2.5 transition-all duration-300 ${
              isPlaying
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
          >
            <PlayButton isPlaying={isPlaying} size="md" variant="white" glow />
          </div>
        )}
      </div>

      <div className="pt-3 px-1">
        <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-brand-light transition-colors truncate">
          {playlist.title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-text-muted mt-1 font-medium">
          <span>{trackCount} {trackCount === 1 ? 'faixa' : 'faixas'}</span>
          <span className="text-[10px] text-text-muted/70 font-mono">
            {new Date(playlist.createdAt).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

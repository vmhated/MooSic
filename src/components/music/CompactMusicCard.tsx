import { Track } from '@/types/domain/music';
import { PlayButton } from '@/components/ui/PlayButton';

export interface CompactMusicCardProps {
  track: Track;
  isCurrent?: boolean;
  isPlaying?: boolean;
  onPlay: () => void;
  className?: string;
}

export function CompactMusicCard({
  track,
  isCurrent = false,
  isPlaying = false,
  onPlay,
  className = '',
}: CompactMusicCardProps) {
  const isCardPlaying = isCurrent && isPlaying;
  const accent = track.accent || '#8B5CF6';

  return (
    <div
      onClick={onPlay}
      className={`group relative flex items-center gap-3 sm:gap-3.5 p-2 sm:p-2.5 rounded-2xl bg-[#0D0E14] hover:bg-[#141520] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 cursor-pointer select-none overflow-hidden shadow-sm hover:shadow-card ${className}`}
    >
      {/* 1. Capa Compacta Quadrada */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-[#101118] border border-white/[0.08] flex-shrink-0 shadow">
        <img
          src={track.coverUrl}
          alt={track.title}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Micro-equalizador se estiver tocando */}
        {isCardPlaying && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
              <span className="w-1 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="w-1 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2/3" />
              <span className="w-1 bg-white rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-4/5" />
            </div>
          </div>
        )}
      </div>

      {/* 2. Título & Artista */}
      <div className="min-w-0 flex-1 pr-1">
        <h4
          className={`text-xs sm:text-sm font-bold truncate transition-colors ${
            isCurrent ? 'text-brand-light' : 'text-white group-hover:text-brand-light'
          }`}
        >
          {track.title}
        </h4>
        <p className="text-[11px] text-text-muted truncate font-medium mt-0.5">
          {track.artistName}
        </p>
      </div>

      {/* 3. Botão Play no Hover à Direita */}
      <div
        className={`flex-shrink-0 pr-1 transition-all duration-200 ${
          isCardPlaying
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
        }`}
      >
        <PlayButton
          isPlaying={isCardPlaying}
          size="sm"
          variant="white"
          accent={accent}
          glow
        />
      </div>
    </div>
  );
}

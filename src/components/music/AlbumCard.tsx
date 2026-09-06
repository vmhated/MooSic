import { PlayButton } from '@/components/ui/PlayButton';

export interface AlbumCardProps {
  id: string;
  title: string;
  artistName: string;
  coverUrl?: string;
  year?: number | string;
  trackCount?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onClick?: () => void;
  className?: string;
}

export function AlbumCard({
  title,
  artistName,
  coverUrl,
  year,
  trackCount,
  isPlaying = false,
  onPlay,
  onClick,
  className = '',
}: AlbumCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative p-3 sm:p-3.5 rounded-3xl bg-[#0D0E14] hover:bg-[#141520] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 cursor-pointer select-none flex flex-col justify-between hover:shadow-card hover:-translate-y-1 ${className}`}
    >
      {/* Capa com Borda de Vinil Sutil */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#101118] border border-white/[0.08] shadow-md">
        <img
          src={coverUrl}
          alt={title}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-images.dzcdn.net/images/cover/9ad06bcb9f0bfe52bbd5e6ff464e4ca4/1000x1000-000000-80-0-0.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Botão Play no Canto Inferior Direito no Hover */}
        {onPlay && (
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
          {title}
        </h4>
        <p className="text-[11px] text-text-muted mt-0.5 truncate font-medium">
          {artistName}
        </p>
        {(year || trackCount) && (
          <p className="text-[10px] text-text-muted/70 mt-1 font-mono">
            {year && <span>{year}</span>}
            {year && trackCount && <span> • </span>}
            {trackCount && <span>{trackCount} faixas</span>}
          </p>
        )}
      </div>
    </div>
  );
}

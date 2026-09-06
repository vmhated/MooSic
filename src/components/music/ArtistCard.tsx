import { PlayButton } from '@/components/ui/PlayButton';
import { artistMetadataService } from '@/services/metadata/artistMetadataService';

export interface ArtistCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  genre?: string;
  isCurrent?: boolean;
  isPlaying?: boolean;
  onPlay?: () => void;
  onClick?: () => void;
  className?: string;
}

export function ArtistCard({
  name,
  avatarUrl,
  genre,
  isCurrent = false,
  isPlaying = false,
  onPlay,
  onClick,
  className = '',
}: ArtistCardProps) {
  const resolvedAvatar = avatarUrl || artistMetadataService.getCachedAvatar(name);
  const isArtistPlaying = isCurrent && isPlaying;

  return (
    <div
      onClick={onClick}
      className={`group relative p-3.5 rounded-3xl bg-[#0D0E14] hover:bg-[#141520] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300 cursor-pointer select-none flex flex-col items-center text-center hover:shadow-card hover:-translate-y-1 ${className}`}
    >
      {/* Retrato Circular do Artista */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-[#101118] border border-white/[0.1] shadow-lg mb-3">
        <img
          src={resolvedAvatar}
          alt={name}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://cdn-images.dzcdn.net/images/artist/0edaeb3873f37a794fe956d23b08107d/1000x1000-000000-80-0-0.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Botão Play Flutuante no Centro no Hover */}
        {onPlay && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
              isArtistPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <PlayButton
              isPlaying={isArtistPlaying}
              size="md"
              variant="white"
              glow
            />
          </div>
        )}
      </div>

      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-brand-light transition-colors truncate max-w-full">
        {name}
      </h4>

      <p className="text-[11px] text-text-muted mt-0.5 truncate max-w-full font-medium">
        {genre ? `${genre} • Artista` : 'Artista Oficial'}
      </p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Music2 } from 'lucide-react';

export interface ArtworkProps {
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | 'full';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  glow?: boolean;
  accent?: string;
  withVinyl?: boolean;
  isPlaying?: boolean;
  className?: string;
}

export function Artwork({
  src,
  fallbackSrc,
  alt = 'Faixa Musical',
  size = 'md',
  rounded = '2xl',
  glow = false,
  accent,
  withVinyl = false,
  isPlaying = false,
  className = '',
}: ArtworkProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src || fallbackSrc);
  const [hasError, setHasError] = useState(!src && !fallbackSrc);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasError(!src && !fallbackSrc);
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const sizes = {
    xs: 'w-8 h-8 min-w-[32px]',
    sm: 'w-10 h-10 min-w-[40px]',
    md: 'w-14 h-14 min-w-[56px]',
    lg: 'w-24 h-24 min-w-[96px]',
    xl: 'w-40 h-40 min-w-[160px]',
    '2xl': 'w-56 h-56 min-w-[224px]',
    hero: 'w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80',
    full: 'w-full h-full',
  };

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-3xl',
    '3xl': 'rounded-4xl',
    full: 'rounded-full',
  };

  return (
    <div className={`relative shrink-0 select-none flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Opcional: Disco de Vinil Sobressalente */}
      {withVinyl && (
        <div
          className={`absolute -right-3 sm:-right-4 w-full h-full rounded-full bg-[#08090C] border border-white/10 shadow-2xl flex items-center justify-center transition-all duration-700 pointer-events-none -z-10 ${
            isPlaying ? 'translate-x-3 sm:translate-x-5' : 'translate-x-0'
          }`}
        >
          <div
            className={`w-[90%] h-[90%] rounded-full border border-white/[0.08] flex items-center justify-center ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            <div className="w-[30%] h-[30%] rounded-full border border-white/30 flex items-center justify-center bg-brand-purple">
              <div className="w-2.5 h-2.5 rounded-full bg-background border border-white/60" />
            </div>
          </div>
        </div>
      )}

      {/* Capa Principal */}
      <div
        className={`relative w-full h-full overflow-hidden bg-[#101118] border border-white/10 shadow-md ${
          roundedClasses[rounded]
        }`}
        style={
          glow
            ? {
                boxShadow: `0 15px 40px -10px ${accent || 'rgba(139, 92, 246, 0.4)'}`,
              }
            : undefined
        }
      >
        {currentSrc && !hasError ? (
          <>
            <img
              src={currentSrc}
              alt={alt}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={handleError}
              onLoad={() => {
                setIsLoaded(true);
                setHasError(false);
              }}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              loading="lazy"
            />
            {/* Shimmer durante o carregamento inicial */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-white/[0.04] animate-pulse" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-elevated text-text-muted">
            <Music2 className="w-1/2 h-1/2 stroke-[1.5] text-brand-light/40" />
          </div>
        )}
      </div>
    </div>
  );
}

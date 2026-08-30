import { useState } from 'react';
import { Music } from 'lucide-react';

export interface ArtworkProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSize?: number;
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | 'full';
  glow?: boolean;
  className?: string;
}

export function Artwork({
  src,
  alt = 'Track Artwork',
  size = 'md',
  customSize,
  rounded = 'xl',
  glow = false,
  className = '',
}: ArtworkProps) {
  const [hasError, setHasError] = useState(!src);

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
    xl: 'w-48 h-48',
    custom: '',
  };

  const roundedClasses = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  const style = customSize ? { width: customSize, height: customSize } : undefined;

  return (
    <div
      className={`relative overflow-hidden bg-surface-elevated border border-surface-border flex items-center justify-center shrink-0 ${
        sizes[size]
      } ${roundedClasses[rounded]} ${glow ? 'shadow-glow' : ''} ${className}`}
      style={style}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-text-muted p-2">
          <Music className="w-1/2 h-1/2 stroke-[1.5] text-brand-purple/70" />
        </div>
      )}
    </div>
  );
}

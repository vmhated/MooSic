import React from 'react';
import { Play, Pause } from 'lucide-react';

export interface PlayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPlaying?: boolean;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  variant?: 'primary' | 'white' | 'glass' | 'ghost';
  accent?: string;
  glow?: boolean;
}

export function PlayButton({
  isPlaying = false,
  isLoading = false,
  size = 'md',
  variant = 'white',
  accent = '#8B5CF6',
  glow = false,
  className = '',
  ...props
}: PlayButtonProps) {
  const sizes = {
    sm: {
      btn: 'w-8 h-8',
      icon: 'w-3.5 h-3.5',
      playOffset: 'ml-0.5',
    },
    md: {
      btn: 'w-11 h-11',
      icon: 'w-4.5 h-4.5',
      playOffset: 'ml-0.5',
    },
    lg: {
      btn: 'w-14 h-14',
      icon: 'w-6 h-6',
      playOffset: 'ml-1',
    },
    hero: {
      btn: 'w-16 h-16 sm:w-18 sm:h-18',
      icon: 'w-7 h-7 sm:w-8 sm:h-8',
      playOffset: 'ml-1',
    },
  };

  const variants = {
    white: 'bg-white text-black hover:bg-neutral-100 hover:scale-105 active:scale-95 shadow-xl',
    primary: 'bg-brand-purple text-white hover:bg-brand-hover hover:scale-105 active:scale-95 shadow-glow',
    glass: 'bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 border border-white/20 hover:scale-105 active:scale-95 shadow-lg',
    ghost: 'bg-transparent text-white hover:text-brand-light hover:scale-110 active:scale-90',
  };

  const currentSize = sizes[size];

  return (
    <button
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple select-none flex-shrink-0 group ${
        currentSize.btn
      } ${variants[variant]} ${className}`}
      aria-label={isPlaying ? 'Pausar reprodução' : 'Iniciar reprodução'}
      style={
        glow
          ? {
              boxShadow: `0 0 25px ${accent || 'rgba(139, 92, 246, 0.5)'}`,
            }
          : undefined
      }
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <Pause className={`${currentSize.icon} fill-current`} />
      ) : (
        <Play className={`${currentSize.icon} fill-current ${currentSize.playOffset}`} />
      )}
    </button>
  );
}

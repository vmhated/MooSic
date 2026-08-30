interface MooLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSymbol?: boolean;
  className?: string;
}

/**
 * Wordmark Oficial MooSic:
 * Tipografia Manrope font-black com "oo" estilizados em degradê violeta espacial.
 */
export function MooLogo({ size = 'md', className = '' }: MooLogoProps) {
  const textSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl sm:text-3xl tracking-tight',
    lg: 'text-4xl sm:text-5xl tracking-tighter',
    xl: 'text-6xl sm:text-7xl tracking-tighter',
  };

  return (
    <div
      className={`inline-flex items-center font-brand font-black select-none group cursor-pointer ${className}`}
      aria-label="MooSic Logo"
    >
      <span className={`font-black text-white ${textSizes[size]} transition-all group-hover:text-brand-light`}>
        M
      </span>
      <span className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand-purple to-indigo-400 ${textSizes[size]} tracking-tight transition-all`}>
        oo
      </span>
      <span className={`font-black text-white ${textSizes[size]} transition-all group-hover:text-brand-light`}>
        Sic
      </span>
    </div>
  );
}

interface MooLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSymbol?: boolean;
  className?: string;
}

/**
 * Componente da Wordmark Oficial da marca "MooSic".
 * Utiliza exclusivamente a fonte Manrope.
 * A estrutura dos dois "O"s está preparada para a estilização gráfica do conceito de infinito.
 */
export function MooLogo({ size = 'md', showSymbol = true, className = '' }: MooLogoProps) {
  const sizeClasses = {
    sm: 'text-lg tracking-tight',
    md: 'text-2xl tracking-tight',
    lg: 'text-4xl tracking-tighter',
    xl: 'text-6xl tracking-tighter',
  };

  const symbolSizes = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-10 h-10 text-xl',
    xl: 'w-16 h-16 text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2 font-brand font-extrabold select-none ${className}`}>
      {showSymbol && (
        <div
          className={`inline-flex items-center justify-center rounded-xl bg-brand-purple/15 text-brand-purple border border-brand-purple/30 shadow-glow ${symbolSizes[size]}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[70%] h-[70%]">
            <path d="M12 12c-2-2.5-4-4-6.5-4A4.5 4.5 0 1 0 10 12.5L14 11.5a4.5 4.5 0 1 1 4.5 4.5c-2.5 0-4.5-1.5-6.5-4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <span className={`font-extrabold text-white ${sizeClasses[size]}`}>
        M<span className="text-brand-purple tracking-normal font-black">oo</span>Sic
      </span>
    </div>
  );
}

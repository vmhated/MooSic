import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tag?: string;
  actionText?: string;
  onAction?: () => void;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  hasScrollControls?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  tag,
  actionText,
  onAction,
  onScrollLeft,
  onScrollRight,
  hasScrollControls = false,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between gap-4 select-none pb-1 ${className}`}>
      {/* Título, Ícone e Subtítulo */}
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          {Icon && (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center text-brand-light shadow-sm flex-shrink-0">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight truncate">
            {title}
          </h2>
          {tag && (
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-light bg-brand-purple/20 border border-brand-purple/30 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl truncate font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Ações / Controles de Scroll */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="text-xs font-bold text-brand-light hover:text-white transition-colors px-2 py-1"
          >
            {actionText}
          </button>
        )}

        {hasScrollControls && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onScrollLeft}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Rolar para a esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onScrollRight}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              aria-label="Rolar para a direita"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

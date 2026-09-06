import React from 'react';
import { Music2 } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'Sua frequência está em silêncio',
  description = 'Nenhuma música ou coleção encontrada para o contexto atual.',
  icon: Icon = Music2,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-surface-elevated/40 border border-white/[0.06] backdrop-blur-md select-none max-w-lg mx-auto my-6 ${className}`}>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center text-brand-light mb-4 shadow-glow">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 opacity-90" />
      </div>

      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

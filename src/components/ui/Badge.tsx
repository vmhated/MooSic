import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'hires' | 'neutral' | 'accent' | 'success' | 'outline' | 'surface';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className = '',
  style,
}: BadgeProps) {
  const variants = {
    brand: 'bg-brand-purple/20 text-brand-light border-brand-purple/35',
    hires: 'bg-white/10 text-white border-white/15 font-mono',
    neutral: 'bg-white/[0.05] text-text-secondary border-white/10',
    accent: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    outline: 'bg-transparent text-text-muted border-white/15',
    surface: 'bg-surface-elevated text-text-secondary border-surface-border',
  };

  const sizes = {
    xs: 'text-[9px] px-2 py-0.5 gap-1',
    sm: 'text-[10px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border shadow-sm select-none ${
        variants[variant]
      } ${sizes[size]} ${className}`}
      style={style}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

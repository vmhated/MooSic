import React from 'react';

export interface BadgeProps {
  variant?: 'brand' | 'surface' | 'outline' | 'accent';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'surface',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-sans font-medium rounded-full border select-none';

  const variants = {
    brand: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
    surface: 'bg-surface-elevated text-text-secondary border-surface-border',
    outline: 'bg-transparent text-text-secondary border-surface-border',
    accent: 'bg-purple-900/40 text-purple-200 border-purple-700/50',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

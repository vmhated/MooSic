import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'outline';
  interactive?: boolean;
}

export function Card({
  variant = 'surface',
  interactive = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseClasses = 'rounded-2xl p-4 transition-all duration-200 border';

  const variants = {
    surface: 'bg-surface border-surface-border',
    elevated: 'bg-surface-elevated border-surface-border',
    outline: 'bg-transparent border-surface-border',
  };

  const interactiveClasses = interactive
    ? 'hover:border-brand-purple/40 hover:bg-surface-elevated hover:shadow-lg cursor-pointer active:scale-[0.99]'
    : '';

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

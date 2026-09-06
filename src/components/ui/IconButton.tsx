import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label: string;
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  label,
  children,
  className = '',
  ...props
}: IconButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple active:scale-95 disabled:opacity-40 disabled:pointer-events-none select-none flex-shrink-0';

  const variants = {
    primary:
      'bg-brand-purple hover:bg-brand-hover text-white shadow-md border border-brand-light/25',
    secondary:
      'bg-white text-black hover:bg-neutral-100 shadow-md',
    outline:
      'bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary hover:text-white border border-surface-border hover:border-white/20',
    ghost:
      'bg-transparent text-text-muted hover:text-white hover:bg-white/[0.08]',
    glass:
      'bg-surface-elevated/80 hover:bg-surface-highlight backdrop-blur-xl text-white border border-surface-border shadow-md',
  };

  const sizes = {
    xs: 'w-7 h-7 min-w-[28px]',
    sm: 'w-8 h-8 min-w-[32px]',
    md: 'w-10 h-10 min-w-[40px] sm:w-10 sm:h-10',
    lg: 'w-12 h-12 min-w-[48px]',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </button>
  );
}

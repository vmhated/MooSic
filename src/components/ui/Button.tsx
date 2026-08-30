import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-sans font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none overflow-hidden';

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-purple via-violet-600 to-indigo-600 hover:from-brand-hover hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.45)] border border-white/25 hover:border-white/50 backdrop-blur-xl group',
    glass:
      'bg-white/[0.08] hover:bg-white/[0.18] backdrop-blur-2xl text-white border border-white/15 hover:border-brand-purple/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)] group',
    secondary:
      'bg-surface-elevated/80 hover:bg-surface-elevated backdrop-blur-xl text-text-primary border border-surface-border hover:border-brand-purple/40',
    outline:
      'bg-surface/30 hover:bg-surface-elevated/80 backdrop-blur-xl border border-white/10 hover:border-brand-purple/60 text-white shadow-sm',
    ghost:
      'bg-transparent text-text-secondary hover:text-white hover:bg-white/5 backdrop-blur-sm',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-xl',
    md: 'text-sm px-5 py-3 gap-2 rounded-2xl',
    lg: 'text-base px-7 py-4 gap-2.5 rounded-2xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {/* Subtle Shimmer Glass Reflection on Hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {leftIcon && <span className="shrink-0 z-10">{leftIcon}</span>}
      {children && <span className="z-10">{children}</span>}
      {rightIcon && <span className="shrink-0 z-10">{rightIcon}</span>}
    </button>
  );
}

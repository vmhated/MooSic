import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-sans font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none overflow-hidden';

  const variants = {
    primary:
      'bg-brand-purple hover:bg-brand-hover text-white shadow-md hover:shadow-glow border border-brand-light/30',
    secondary:
      'bg-white text-black hover:bg-neutral-100 shadow-md font-extrabold',
    outline:
      'bg-white/[0.04] hover:bg-white/[0.08] text-text-primary border border-surface-border hover:border-white/20',
    ghost:
      'bg-transparent text-text-muted hover:text-white hover:bg-white/[0.05]',
    glass:
      'bg-surface-elevated/70 hover:bg-surface-elevated/90 backdrop-blur-xl text-white border border-surface-border shadow-card',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-xl min-h-[36px]',
    md: 'text-xs sm:text-sm px-5 py-2.5 gap-2 rounded-2xl min-h-[44px]',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 rounded-2xl min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

/**
 * MooSic Design System: Typography Tokens Foundation
 * 
 * - Manrope: Wordmark e Tipografia de Marca
 * - Plus Jakarta Sans: Toda a Interface Editorial do Produto
 */

export const typography = {
  fontFamily: {
    brand: '"Manrope", sans-serif',
    interface: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  scale: {
    display: {
      fontSize: '2.5rem', // 40px
      lineHeight: '3rem', // 48px
      fontWeight: '800',
      letterSpacing: '-0.03em',
    },
    headingXL: {
      fontSize: '2rem', // 32px
      lineHeight: '2.5rem', // 40px
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    headingLG: {
      fontSize: '1.5rem', // 24px
      lineHeight: '2rem', // 32px
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    headingMD: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.75rem', // 28px
      fontWeight: '700',
      letterSpacing: '-0.015em',
    },
    title: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    body: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.375rem', // 22px
      fontWeight: '400',
      letterSpacing: '0',
    },
    bodySmall: {
      fontSize: '0.8125rem', // 13px
      lineHeight: '1.25rem', // 20px
      fontWeight: '400',
      letterSpacing: '0.005em',
    },
    label: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1rem', // 16px
      fontWeight: '600',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.6875rem', // 11px
      lineHeight: '0.875rem', // 14px
      fontWeight: '500',
      letterSpacing: '0.025em',
    },
    metadata: {
      fontSize: '0.625rem', // 10px
      lineHeight: '0.75rem', // 12px
      fontWeight: '700',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

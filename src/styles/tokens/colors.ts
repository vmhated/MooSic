/**
 * MooSic Design System: Color Tokens Foundation
 * 
 * Hierarquia Visual Estrita:
 * 1. Preto / Neutros Profundos = Estrutura e Superfícies
 * 2. Branco / Neutros Claros = Conteúdo e Legibilidade
 * 3. Roxo = Assinatura Icônica da Marca MooSic
 * 4. Artwork = Iluminação e Atmosfera Dinâmica Sutil
 */

export const colors = {
  // 1. Estrutura e Superfícies
  bg: {
    base: '#07080B',
    surface: '#0D0E14',
    elevated: '#141520',
    highlight: '#1B1C2B',
    glass: 'rgba(13, 14, 20, 0.75)',
    glassElevated: 'rgba(20, 21, 32, 0.85)',
  },

  // 2. Conteúdo e Tipografia
  text: {
    primary: '#FFFFFF',
    secondary: '#E2E2E8',
    muted: '#9E9EB0',
    subtle: '#606072',
    inverse: '#07080B',
  },

  // 3. Bordas e Divisores Sutis
  border: {
    subtle: 'rgba(255, 255, 255, 0.07)',
    medium: 'rgba(255, 255, 255, 0.12)',
    highlight: 'rgba(255, 255, 255, 0.22)',
    brand: 'rgba(139, 92, 246, 0.35)',
  },

  // 4. Assinatura de Marca MooSic (Purple System)
  brand: {
    purple: '#8B5CF6',
    hover: '#7C3AED',
    light: '#A78BFA',
    dark: '#6D28D9',
    faint: 'rgba(139, 92, 246, 0.15)',
    glow: 'rgba(139, 92, 246, 0.35)',
  },

  // 5. Semântica e Feedback
  feedback: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    like: '#EC4899',
  },

  // 6. Atmosfera Dinâmica Baseada na Capa
  dynamic: {
    vibrant: 'var(--dynamic-vibrant, #8B5CF6)',
    muted: 'var(--dynamic-muted, #4C1D95)',
    accent: 'var(--dynamic-accent, #A78BFA)',
    background: 'var(--dynamic-bg, #07080B)',
  }
};

// Backwards compatibility para módulos existentes
export const brandColors = {
  purple: {
    DEFAULT: colors.brand.purple,
    hover: colors.brand.hover,
    light: colors.brand.light,
    dark: colors.brand.dark,
  },
};

export const uiColors = {
  dark: {
    bgBase: colors.bg.base,
    bgSurface: colors.bg.surface,
    bgSurfaceElevated: colors.bg.elevated,
    border: colors.border.subtle,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textMuted: colors.text.muted,
  },
};

export const dynamicMusicTokens = {
  vibrant: colors.dynamic.vibrant,
  muted: colors.dynamic.muted,
  darkVibrant: 'var(--dynamic-dark-vibrant, #1E1B4B)',
  lightVibrant: 'var(--dynamic-light-vibrant, #DDD6FE)',
  backgroundGradStart: 'var(--dynamic-bg-start, #07080B)',
  backgroundGradEnd: 'var(--dynamic-bg-end, #0D0E14)',
};

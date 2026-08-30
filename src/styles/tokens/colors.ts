/**
 * System Token Foundation: Cores Institucionais e Cores Dinâmicas de Música
 */

export const brandColors = {
  purple: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED', // Institutional Brand Primary
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  accent: '#A855F7',
};

export const uiColors = {
  dark: {
    bgBase: '#0A0A0C',
    bgCard: '#121216',
    bgElevated: '#1A1A20',
    border: '#24242D',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
  },
  light: {
    bgBase: '#FFFFFF',
    bgCard: '#F9FAFB',
    bgElevated: '#F3F4F6',
    border: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
  },
};

/**
 * Cores Dinâmicas baseadas na Capa da Música Atualmente Reproduzida
 * Utilizam variáveis CSS para mutação em tempo de execução sem alterar o tema institucional
 */
export const dynamicMusicTokens = {
  vibrant: 'var(--dynamic-vibrant, #7C3AED)',
  muted: 'var(--dynamic-muted, #4C1D95)',
  darkVibrant: 'var(--dynamic-dark-vibrant, #1E1B4B)',
  lightVibrant: 'var(--dynamic-light-vibrant, #DDD6FE)',
  backgroundGradStart: 'var(--dynamic-bg-start, #0A0A0C)',
  backgroundGradEnd: 'var(--dynamic-bg-end, #121216)',
};

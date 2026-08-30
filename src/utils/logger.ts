/**
 * Utilitário de Logging leve para o MooSic.
 * Em ambiente de produção (import.meta.env.PROD), mensagens de debug são desativadas
 * para evitar vazamentos de dados ou respostas de API nos consoles de navegadores ou APKs.
 */

const isProd = import.meta.env.PROD;

export const logger = {
  debug: (...args: unknown[]) => {
    if (!isProd) {
      console.debug('[MooSic Debug]:', ...args);
    }
  },

  info: (...args: unknown[]) => {
    console.info('[MooSic Info]:', ...args);
  },

  warn: (...args: unknown[]) => {
    console.warn('[MooSic Warning]:', ...args);
  },

  error: (message: string, error?: unknown) => {
    console.error('[MooSic Error]:', message, error || '');
  },
};

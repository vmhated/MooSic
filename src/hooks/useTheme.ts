import { useState } from 'react';
import { initialThemeState } from '@/stores/themeStore';

/**
 * Hook para controle de tema (modo escuro/claro e extração de cores dinâmicas da capa da música)
 */
export function useTheme() {
  const [theme, setThemeState] = useState(initialThemeState);

  const setThemeMode = (mode: 'dark' | 'light' | 'system') => {
    setThemeState((prev) => ({ ...prev, mode }));
  };

  const setDynamicColors = (colors: { vibrant: string; muted: string; darkVibrant: string; lightVibrant: string } | null) => {
    setThemeState((prev) => ({ ...prev, dynamicColors: colors }));
  };

  return {
    mode: theme.mode,
    dynamicColors: theme.dynamicColors,
    setThemeMode,
    setDynamicColors,
  };
}

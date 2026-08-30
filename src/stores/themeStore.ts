export interface DynamicThemeColors {
  vibrant: string;
  muted: string;
  darkVibrant: string;
  lightVibrant: string;
}

export interface ThemeState {
  mode: 'dark' | 'light' | 'system';
  dynamicColors: DynamicThemeColors | null;
}

export const initialThemeState: ThemeState = {
  mode: 'dark',
  dynamicColors: null,
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  themePreference: 'dark' | 'light' | 'system';
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

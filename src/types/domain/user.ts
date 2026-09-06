export type MembershipTier = 'free' | 'pro' | 'audiophile';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  membershipTier: MembershipTier;
  themePreference: 'dark' | 'light' | 'system';
  createdAt: number;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

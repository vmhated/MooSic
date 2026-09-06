import type { Session } from '@supabase/supabase-js';

export type MembershipTier = 'free' | 'pro' | 'audiophile';
export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_status: OnboardingStatus;
  created_at: string;
  updated_at: string;
}

// O estado de Autenticação agora compõe o Profile do BD + User do Auth
export interface AuthUser extends Profile {
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
}

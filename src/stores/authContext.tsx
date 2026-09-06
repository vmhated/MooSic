import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types/domain/user';
import { supabase } from '@/lib/supabase';
import { profileRepository } from '@/repositories/profile/profileRepository';
import { migrationEngine } from '@/services/migration/migrationEngine';
import { Session } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;

  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'reset';
  openAuthModal: (mode?: 'login' | 'signup' | 'reset') => void;
  closeAuthModal: () => void;

  signIn: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password?: string, username?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'reset'>('login');

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            await fetchAndSetProfile(currentSession.user);
          } else {
            setIsLoading(false);
          }
        }
      } catch (err) {
        logger.error('[Auth] Failed to initialize session', err);
        if (mounted) setIsLoading(false);
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      logger.info(`[Auth] State changed: ${event}`);
      if (mounted) {
        setSession(currentSession);
        
        if (currentSession?.user) {
           await fetchAndSetProfile(currentSession.user);
        } else {
           setUser(null);
           setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchAndSetProfile = async (authUser: any) => {
    try {
      let profile = await profileRepository.getProfile(authUser.id);
      
      // If profile doesn't exist, create it. Supabase Auth doesn't trigger profiles table directly unless via Postgres Trigger.
      // This is a safe fallback creation in frontend.
      if (!profile) {
        const metadataUsername = authUser.user_metadata?.username;
        const emailPrefix = authUser.email?.split('@')[0] || 'user';
        const fallbackUsername = metadataUsername || `${emailPrefix}_${Math.floor(Math.random() * 10000)}`;
        
        profile = await profileRepository.createProfile({
          id: authUser.id,
          username: fallbackUsername,
          display_name: emailPrefix,
        });
      }

      const authUserObj = {
        ...profile,
        email: authUser.email,
      } as AuthUser;
      
      setUser(authUserObj);
      
      // Assincronamente inicia migração (sem bloquear loading)
      migrationEngine.runMigration(authUserObj);
    } catch (err) {
      logger.error('[Auth] Failed to fetch profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'reset' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signIn = async (email: string, password?: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
    if (!error) closeAuthModal();
    setIsLoading(false);
    return { error };
  };

  const signUp = async (email: string, password?: string, username?: string) => {
    setIsLoading(true);
    
    if (username) {
       const exists = await profileRepository.checkUsernameExists(username);
       if (exists) {
          setIsLoading(false);
          return { error: new Error('Username already exists') };
       }
    }

    const { error } = await supabase.auth.signUp({ 
      email, 
      password: password || '',
      options: {
        data: { username }
      }
    });
    
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    return { error };
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`,
    });
    setIsLoading(false);
    return { error };
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    return { error };
  };

  const resendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/#/welcome`
      }
    });
    setIsLoading(false);
    return { error };
  };

  // session.user.email_confirmed_at checks if email is verified.
  const isEmailVerified = !!session?.user?.email_confirmed_at || !!session?.user?.phone_confirmed_at;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        isEmailVerified,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

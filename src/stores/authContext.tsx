import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/domain/user';
import { logger } from '@/utils/logger';

const AUTH_STORAGE_KEY = 'moosic_auth_user_v1';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'usr-guest-001',
  name: 'Ouvinte MooSic',
  email: 'ouvinte@moosic.app',
  membershipTier: 'audiophile',
  themePreference: 'dark',
  createdAt: Date.now(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return DEFAULT_GUEST_USER;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_GUEST_USER;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulação de autenticação com validação local
      await new Promise((res) => setTimeout(res, 600));

      const cleanEmail = email.trim();
      const extractedName = cleanEmail.split('@')[0];
      const capitalizedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

      const loggedUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: capitalizedName || 'Membro MooSic',
        email: cleanEmail,
        membershipTier: 'audiophile',
        themePreference: 'dark',
        createdAt: Date.now(),
      };

      setUser(loggedUser);
      setIsAuthModalOpen(false);
      logger.info(`[Auth] Usuário logado: ${loggedUser.name} (${loggedUser.email})`);
      return true;
    } catch (err) {
      logger.error('[Auth] Falha no login:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim() || 'Novo Membro',
        email: email.trim(),
        membershipTier: 'audiophile',
        themePreference: 'dark',
        createdAt: Date.now(),
      };

      setUser(newUser);
      setIsAuthModalOpen(false);
      logger.info(`[Auth] Nova conta criada: ${newUser.name} (${newUser.email})`);
      return true;
    } catch (err) {
      logger.error('[Auth] Falha no cadastro:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = () => {
    setUser(DEFAULT_GUEST_USER);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    logger.info('[Auth] Usuário desconectado');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

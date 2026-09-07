import { RouterProvider, useRouter } from '@/app/routes/router';
import { PlayerProvider } from '@/stores/playerContext';
import { AuthProvider, useAuth } from '@/stores/authContext';
import { AuthModal } from '@/components/modals/AuthModal';
import { LandingPage } from '@/features/landing';
import { AppLayout } from '@/app/layouts';

import { useEffect } from 'react';

/**
 * Switcher de Telas Principal do MooSic.
 */
function MainRouterOutlet() {
  const { isApp, route, navigate } = useRouter();
  const { isAuthenticated, isLoading, user, openAuthModal } = useAuth();

  // Guard 1: Usuário não autenticado tenta acessar rota protegida
  useEffect(() => {
    if (!isLoading && isApp && !isAuthenticated) {
      navigate('/');
      openAuthModal('login');
    }
  }, [isLoading, isApp, isAuthenticated, navigate, openAuthModal]);

  // Guard 2: Usuário autenticado com onboarding pendente é redirecionado para /app/welcome
  // Funciona para contas novas E contas existentes que nunca fizeram o onboarding.
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user?.onboarding_status === 'not_started' &&
      route !== 'app-welcome'
    ) {
      navigate('/app/welcome');
    }
  }, [isLoading, isAuthenticated, user?.onboarding_status, route, navigate]);

  useEffect(() => {
    if (route === 'reset-password' && !isLoading) {
      openAuthModal('reset');
    }
  }, [route, isLoading, openAuthModal]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#07080B]">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isApp && isAuthenticated) {
    return <AppLayout />;
  }

  return <LandingPage />;
}


export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <RouterProvider>
          <MainRouterOutlet />
          <AuthModal />
        </RouterProvider>
      </PlayerProvider>
    </AuthProvider>
  );
}

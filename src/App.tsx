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
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoading && isApp && !isAuthenticated) {
      navigate('/');
      openAuthModal('login');
    }
  }, [isLoading, isApp, isAuthenticated, navigate, openAuthModal]);

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

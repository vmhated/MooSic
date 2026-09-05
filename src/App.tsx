import { RouterProvider, useRouter } from '@/app/routes/router';
import { PlayerProvider } from '@/stores/playerContext';
import { LandingPage } from '@/features/landing';
import { AppLayout } from '@/app/layouts';

/**
 * Switcher de Telas Principal do MooSic.
 * Se a rota for do Web Player (/app, /app/search, /app/library), renderiza o AppLayout.
 * Caso contrário, renderiza a experiência imersiva da LandingPage.
 */
function MainRouterOutlet() {
  const { isApp } = useRouter();

  if (isApp) {
    return <AppLayout />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <PlayerProvider>
      <RouterProvider>
        <MainRouterOutlet />
      </RouterProvider>
    </PlayerProvider>
  );
}

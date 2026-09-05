import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppRoute = 'landing' | 'app-home' | 'app-search' | 'app-library' | 'app-playlist';

interface RouterContextType {
  route: AppRoute;
  path: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
  isApp: boolean;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parseRouteFromLocation(): { route: AppRoute; path: string; params: Record<string, string> } {
  // Dá suporte tanto a hash quanto a pathname direto
  const hash = window.location.hash.replace(/^#/, '');
  const path = hash ? hash : window.location.pathname;

  if (path.startsWith('/app/playlist/') || path.startsWith('app/playlist/')) {
    const parts = path.split('/app/playlist/');
    const id = parts[1] || '';
    return { route: 'app-playlist', path, params: { id } };
  }
  if (path.startsWith('/app/search') || path.startsWith('app/search')) {
    return { route: 'app-search', path: '/app/search', params: {} };
  }
  if (path.startsWith('/app/library') || path.startsWith('app/library')) {
    return { route: 'app-library', path: '/app/library', params: {} };
  }
  if (path.startsWith('/app') || path.startsWith('app')) {
    return { route: 'app-home', path: '/app', params: {} };
  }
  return { route: 'landing', path: '/', params: {} };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<{ route: AppRoute; path: string; params: Record<string, string> }>(
    parseRouteFromLocation
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(parseRouteFromLocation());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    // Normaliza
    const cleanPath = to.startsWith('/') ? to : `/${to}`;
    window.location.hash = cleanPath;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isApp = currentRoute.route !== 'landing';

  return (
    <RouterContext.Provider
      value={{
        route: currentRoute.route,
        path: currentRoute.path,
        params: currentRoute.params,
        navigate,
        isApp,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

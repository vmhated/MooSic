import React from 'react';
import { useRouter } from '@/app/routes/router';
import { Home, Search, Library, Activity } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { route, navigate } = useRouter();

  const navItems = [
    {
      id: 'home',
      label: 'Início',
      icon: Home,
      path: '/app',
      isActive: route === 'app-home',
    },
    {
      id: 'search',
      label: 'Explorar',
      icon: Search,
      path: '/app/search',
      isActive: route === 'app-search',
    },
    {
      id: 'library',
      label: 'Biblioteca',
      icon: Library,
      path: '/app/library',
      isActive: route === 'app-library' || route === 'app-playlist',
    },
    {
      id: 'stats',
      label: 'Cartografia',
      icon: Activity,
      path: '/app/stats',
      isActive: route === 'app-stats',
    },
  ];

  return (
    <nav
      aria-label="Navegação mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08090C]/90 backdrop-blur-2xl border-t border-white/[0.08] px-3 pt-2 pb-safe select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] transition-all ${
                item.isActive
                  ? 'text-white'
                  : 'text-text-muted hover:text-text-secondary active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    item.isActive ? 'text-brand-light scale-110' : ''
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-brand-light shadow-glow" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight transition-colors ${
                  item.isActive ? 'font-black text-brand-light' : 'font-semibold text-text-muted'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

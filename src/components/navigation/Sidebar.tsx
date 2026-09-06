import React from 'react';
import { MooLogo } from '@/components/common/MooLogo';
import { useRouter } from '@/app/routes/router';
import { usePlaylists } from '@/stores/playlistStore';
import { PLAYLIST_THEMES } from '@/constants/playlistThemes';
import {
  Home,
  Search,
  Library,
  Activity,
  Plus,
  X,
  ListMusic,
  Sparkles,
  Flame,
  Radio,
  Zap,
  Compass,
  Disc,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Radio,
  Zap,
  Compass,
  Sparkles,
  Disc,
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { route, path, navigate } = useRouter();
  const { playlists, openCreatePlaylistModal } = usePlaylists();

  const navItems = [
    {
      id: 'app-home',
      label: 'Início',
      icon: Home,
      path: '/app',
      active: route === 'app-home',
    },
    {
      id: 'app-search',
      label: 'Explorar & Buscar',
      icon: Search,
      path: '/app/search',
      active: route === 'app-search',
    },
    {
      id: 'app-library',
      label: 'Sua Biblioteca',
      icon: Library,
      path: '/app/library',
      active: route === 'app-library',
    },
    {
      id: 'app-stats',
      label: 'Cartografia Sonora',
      icon: Activity,
      path: '/app/stats',
      active: route === 'app-stats',
    },
  ];

  const handleNav = (targetPath: string) => {
    navigate(targetPath);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Backdrop para mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-60 lg:w-64 bg-[#07080B]/95 md:bg-[#07080B]/90 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 ease-editorial select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6 overflow-hidden flex flex-col flex-1">
          {/* Header da Sidebar: Logo & Botão de Fechar Mobile */}
          <div className="flex items-center justify-between flex-shrink-0 pt-1">
            <button
              onClick={() => handleNav('/app')}
              className="text-left focus:outline-none group"
              aria-label="Ir para o Início do MooSic"
            >
              <MooLogo size="md" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white"
                aria-label="Fechar navegação"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navegação Principal */}
          <nav className="space-y-1 flex-shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                    item.active
                      ? 'bg-brand-purple/20 text-brand-light border border-brand-purple/35 shadow-sm'
                      : 'text-text-muted hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        item.active ? 'text-brand-light scale-110' : 'text-text-muted'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-light shadow-[0_0_8px_#A78BFA]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Divisor Sutil */}
          <div className="h-[1px] bg-white/[0.08] flex-shrink-0" />

          {/* Seção de Playlists e Criação */}
          <div className="flex flex-col min-h-0 flex-1 space-y-2">
            <div className="px-1 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-text-muted">
                Playlists & Coleções
              </span>
              <button
                onClick={() => {
                  openCreatePlaylistModal();
                  if (onClose) onClose();
                }}
                className="p-1 rounded-full bg-white/[0.05] hover:bg-brand-purple hover:text-white text-text-muted transition-colors"
                title="Criar nova playlist"
                aria-label="Criar nova playlist"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lista Scrollável de Playlists */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-none">
              {playlists.length === 0 ? (
                <div className="py-6 text-center space-y-2 px-2">
                  <p className="text-xs text-text-muted font-medium">Nenhuma playlist ainda</p>
                  <button
                    onClick={() => {
                      openCreatePlaylistModal();
                      if (onClose) onClose();
                    }}
                    className="text-xs text-brand-light hover:underline font-bold"
                  >
                    + Criar primeira lista
                  </button>
                </div>
              ) : (
                playlists.map((pl) => {
                  const theme = PLAYLIST_THEMES[pl.themeId] || PLAYLIST_THEMES['cyberpunk-neon'];
                  const Icon = ICON_MAP[theme.iconName] || ListMusic;
                  const isPlActive = path === `/app/playlist/${pl.id}`;

                  return (
                    <button
                      key={pl.id}
                      onClick={() => handleNav(`/app/playlist/${pl.id}`)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isPlActive
                          ? 'bg-white/10 text-white font-bold border border-white/15'
                          : 'text-text-muted hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner"
                          style={{ background: theme.gradient }}
                        >
                          <Icon className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="truncate">{pl.title}</span>
                      </div>

                      <span className="text-[10px] font-mono text-text-muted ml-2">
                        {pl.tracks.length}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Rodapé da Sidebar: Info de Qualidade Acústica */}
        <div className="pt-3 border-t border-white/[0.08] flex-shrink-0">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-text-muted">ÁUDIO 24b / 96kHz</span>
            </div>
            <span className="text-[10px] font-black text-brand-light uppercase">Hi-Fi</span>
          </div>
        </div>
      </aside>
    </>
  );
};

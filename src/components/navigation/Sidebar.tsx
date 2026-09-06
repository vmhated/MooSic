import React from 'react';
import { MooLogo } from '@/components/common/MooLogo';
import { useRouter } from '@/app/routes/router';
import { usePlayer } from '@/stores/playerContext';
import { usePlaylists } from '@/stores/playlistStore';
import { PLAYLIST_THEMES } from '@/constants/playlistThemes';
import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  ArrowLeft,
  X,
  Disc3,
  ListMusic,
  Flame,
  Radio,
  Zap,
  Compass,
  Sparkles,
  Disc,
} from 'lucide-react';

const ICON_MAP = {
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
  const { likedTrackIds } = usePlayer();
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
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-60 lg:w-64 bg-[#090A0E]/95 md:bg-[#090A0E]/80 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5 overflow-hidden flex flex-col flex-1">
          {/* Header da Sidebar: Logo & Botão de Fechar Mobile */}
          <div className="flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => handleNav('/app')}
              className="text-left focus:outline-none group"
              aria-label="Ir para o Início"
            >
              <MooLogo size="md" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white"
                aria-label="Fechar menu"
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                    item.active
                      ? 'bg-brand-purple/20 text-brand-light font-bold border border-brand-purple/35 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        item.active ? 'text-brand-light scale-110' : 'text-text-muted group-hover:text-white'
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

          {/* Divisor */}
          <div className="h-[1px] bg-white/[0.08] flex-shrink-0" />

          {/* Seção de Playlists e Criação */}
          <div className="flex flex-col min-h-0 flex-1 space-y-2">
            <div className="px-1 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-text-muted">
                Playlists & Mixes
              </span>
              <button
                onClick={() => openCreatePlaylistModal()}
                className="p-1 rounded-lg bg-white/5 hover:bg-brand-purple hover:text-white text-text-muted transition-all"
                title="Criar nova playlist"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botão em Destaque: Criar Nova Playlist */}
            <button
              onClick={() => openCreatePlaylistModal()}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border border-dashed border-white/15 hover:border-brand-purple/50 bg-white/[0.02] hover:bg-brand-purple/10 text-xs font-bold text-text-secondary hover:text-white transition-all flex-shrink-0 group"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-purple to-pink-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>Nova Playlist</span>
            </button>

            {/* Músicas Curtidas Fixas */}
            <button
              onClick={() => handleNav('/app/library')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all flex-shrink-0 ${
                route === 'app-library'
                  ? 'text-white bg-white/10 border border-white/10'
                  : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm">
                  <Heart className="w-3.5 h-3.5 text-white fill-current" />
                </div>
                <span className="truncate">Músicas Curtidas</span>
              </div>
              {likedTrackIds.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white">
                  {likedTrackIds.length}
                </span>
              )}
            </button>

            {/* Lista Scrollável de Playlists Customizadas */}
            <div className="space-y-1 overflow-y-auto pr-1 scrollbar-none flex-1">
              {playlists.map((pl) => {
                const theme = PLAYLIST_THEMES[pl.themeId] || PLAYLIST_THEMES['cyberpunk-neon'];
                const IconComp = ICON_MAP[theme.iconName] || ListMusic;
                const isCurrent = path === `/app/playlist/${pl.id}`;

                return (
                  <button
                    key={pl.id}
                    onClick={() => handleNav(`/app/playlist/${pl.id}`)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isCurrent
                        ? 'text-white bg-white/10 border border-white/10 shadow-sm'
                        : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <div
                        className={`w-6 h-6 rounded-md bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}
                      >
                        <IconComp className="w-3 h-3" />
                      </div>
                      <span className="truncate">{pl.title}</span>
                    </div>

                    <span className="text-[10px] text-text-muted group-hover:text-white/70 font-mono">
                      {pl.tracks.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="space-y-3 pt-4 border-t border-white/[0.08] flex-shrink-0">
          {/* Card de Qualidade de Áudio */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-3 text-xs space-y-1 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-light font-semibold">
                <Disc3 className="w-3.5 h-3.5 animate-spin text-brand-purple" style={{ animationDuration: '6s' }} />
                <span>Áudio Master Hi-Fi</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-brand-light bg-brand-purple/20 px-1.5 py-0.5 rounded border border-brand-purple/30">
                24-bit / 96kHz
              </span>
            </div>
            <p className="text-[10px] text-text-muted leading-tight">
              Transmissão de estúdio em alta fidelidade e processamento puro.
            </p>
          </div>

          {/* Botão de Retorno à Página Principal / Conhecer MooSic */}
          <button
            onClick={() => handleNav('/')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sobre o MooSic</span>
          </button>
        </div>
      </aside>
    </>
  );
};

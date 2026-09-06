import React, { useState, useEffect } from 'react';
import { useRouter } from '@/app/routes/router';
import { usePlaylists } from '@/stores/playlistStore';
import { useAuth } from '@/stores/authContext';
import { binauralResonator } from '@/services/audio/binauralResonatorService';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  Sparkles,
  ExternalLink,
  User,
  Waves,
  LogIn,
  LogOut,
  Shield,
} from 'lucide-react';

interface TopbarProps {
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
}) => {
  const { route, navigate } = useRouter();
  const { openResonatorModal } = usePlaylists();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [internalQuery, setInternalQuery] = useState(searchQuery || '');
  const [resonatorState, setResonatorState] = useState(binauralResonator.getState());
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = binauralResonator.subscribe((state) => {
      setResonatorState(state);
    });
    return unsub;
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (route !== 'app-search') {
      navigate('/app/search');
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
    if (route !== 'app-search' && val.trim().length > 0) {
      navigate('/app/search');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#07080B]/85 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      {/* Esquerda: Botão Menu Mobile & Controles de Histórico */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 transition-colors flex-shrink-0"
            aria-label="Abrir navegação lateral"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => window.history.back()}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-text-secondary hover:text-white border border-white/[0.08] transition-colors"
            aria-label="Voltar página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.history.forward()}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-text-secondary hover:text-white border border-white/[0.08] transition-colors"
            aria-label="Avançar página seguinte"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Busca Integrada */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="O que você quer ouvir no MooSic?"
            value={searchQuery !== undefined ? searchQuery : internalQuery}
            onChange={handleSearchInputChange}
            className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.12] border border-white/10 focus:border-brand-purple/60 rounded-full pl-9 pr-12 py-1.5 text-xs text-white placeholder-text-muted transition-all outline-none focus:ring-2 focus:ring-brand-purple/25 shadow-inner"
          />
          {route !== 'app-search' && (
            <kbd className="hidden lg:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              Ctrl K
            </kbd>
          )}
        </form>
      </div>

      {/* Direita: Ações Inovadoras & Perfil */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {/* BOTÃO DO MOOSIC RESONATOR (Frequências Binaurais) */}
        <button
          onClick={openResonatorModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md ${
            resonatorState.isRunning
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/90 border-white/10'
          }`}
          title="Abrir o sintetizador de frequências mentais MooSic Resonator"
        >
          <Waves
            className={`w-3.5 h-3.5 ${
              resonatorState.isRunning ? 'animate-pulse text-emerald-400' : 'text-brand-purple'
            }`}
          />
          <span className="hidden sm:inline-block">
            {resonatorState.isRunning
              ? `Resonator Ativo (${resonatorState.preset})`
              : 'Sintonia 432Hz'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              resonatorState.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-brand-purple'
            }`}
          />
        </button>

        {/* Atalho para Sobre o MooSic / Landing */}
        <button
          onClick={() => navigate('/')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-text-secondary hover:text-white transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-purple group-hover:rotate-12 transition-transform" />
          <span>Sobre o MooSic</span>
          <ExternalLink className="w-3 h-3 text-text-muted" />
        </button>

        {/* Avatar e Status do Usuário ou Botão Entrar */}
        {isAuthenticated && user ? (
          <div className="relative pl-2 border-l border-white/10">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/5 transition-all text-left"
              aria-label="Abrir menu de usuário"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple via-fuchsia-500 to-indigo-500 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-[#0D0E15] flex items-center justify-center text-white font-extrabold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background"
                  title="Online no MooSic Hi-Fi"
                />
              </div>
              <div className="hidden xl:block leading-tight pr-1">
                <p className="text-xs font-bold text-text-primary truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-brand-light font-mono">Hi-Fi Pro</p>
              </div>
            </button>

            {/* Dropdown Menu do Usuário */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D0E17]/95 backdrop-blur-2xl border border-white/15 p-2 shadow-2xl z-50 animate-fade-in space-y-1">
                  <div className="px-3 py-2 border-b border-white/5 space-y-0.5">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-text-muted truncate font-mono">{user.email}</p>
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                      <Shield className="w-3 h-3" />
                      <span>Assinatura Audiophile Ativa</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-brand-light" />
                    <span>Trocar de Conta</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-purple to-purple-600 hover:from-brand-hover hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-brand-purple/20 transition-all hover:scale-105 active:scale-95 ml-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </button>
        )}
      </div>
    </header>
  );
};

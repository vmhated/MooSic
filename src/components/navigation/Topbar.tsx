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
  Waves,
  LogIn,
  LogOut,
  User,
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
  const { user, isAuthenticated, openAuthModal, signOut } = useAuth();
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
            aria-label="Abrir menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => window.history.back()}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-text-secondary hover:text-white border border-white/[0.08] transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.history.forward()}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-text-secondary hover:text-white border border-white/[0.08] transition-colors"
            aria-label="Avançar"
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
            className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-[#0D0E14] border border-white/10 focus:border-brand-purple/60 rounded-full pl-9 pr-12 py-2 text-xs text-white placeholder-text-muted transition-all outline-none focus:ring-2 focus:ring-brand-purple/25 shadow-inner"
          />
          {route !== 'app-search' && (
            <kbd className="hidden lg:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-mono">
              Ctrl K
            </kbd>
          )}
        </form>
      </div>

      {/* Direita: Ações & Perfil */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {/* BOTÃO DO MOOSIC RESONATOR */}
        <button
          onClick={openResonatorModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
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

        {/* Atalho para Sobre o MooSic */}
        <button
          onClick={() => navigate('/')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-text-secondary hover:text-white transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-purple group-hover:rotate-12 transition-transform" />
          <span>Sobre o MooSic</span>
        </button>

        {/* Perfil do Usuário / Autenticação */}
        <div className="relative">
          {isAuthenticated && user ? (
            <div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all text-xs font-bold text-white"
                aria-label="Menu de perfil"
              >
                <div className="w-6 h-6 rounded-full bg-brand-purple text-white flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.display_name || user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (user.display_name || user.username || 'U').charAt(0)
                  )}
                </div>
                <span className="hidden sm:inline-block truncate max-w-[90px]">{user.display_name || user.username}</span>
                <span className="hidden lg:inline-block text-[9px] bg-brand-purple/20 text-brand-light px-1.5 py-0.5 rounded border border-brand-purple/30">
                  Hi-Fi
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D0E14] border border-white/15 p-2 shadow-2xl z-50 space-y-1">
                  <div className="p-2.5 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{user.display_name || user.username}</p>
                    <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-brand-light" />
                      <span className="text-[10px] text-brand-light font-mono uppercase">
                        Ouvinte Hi-Fi Master
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/app/stats');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-text-muted" />
                    <span>Cartografia Sonora</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Encerrar Sessão</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple hover:bg-brand-hover text-white text-xs font-bold shadow-glow hover:scale-105 active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

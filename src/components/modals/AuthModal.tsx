import React, { useState } from 'react';
import { useAuth } from '@/stores/authContext';
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Disc,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
    loginAsGuest,
    isLoading,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }

    if (authModalMode === 'signup' && !name.trim()) {
      setErrorMessage('Por favor, informe seu nome de ouvinte.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('A senha deve conter ao menos 4 caracteres.');
      return;
    }

    if (authModalMode === 'login') {
      const ok = await login(email, password);
      if (!ok) setErrorMessage('Credenciais inválidas. Tente novamente.');
    } else {
      const ok = await signup(name, email, password);
      if (!ok) setErrorMessage('Falha ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop com Blur Profundo e Animação Fade */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Container Central do Modal */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-b from-[#11131F] via-[#0B0C14] to-[#07080B] border border-white/15 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Glow dinâmico de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-purple/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Botão de Fechar */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabeçalho do Modal */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-fuchsia-500 p-0.5 shadow-lg shadow-brand-purple/30 flex items-center justify-center">
              <Disc className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                <span>MooSic</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-brand-purple/30 text-brand-light px-2 py-0.5 rounded-full border border-brand-purple/30">
                  Hi-Fi
                </span>
              </span>
              <p className="text-[11px] text-text-muted">Plataforma de Escuta e Sessões</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {authModalMode === 'login' ? 'Bem-vindo de volta' : 'Crie sua identidade musical'}
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {authModalMode === 'login'
                ? 'Acesse suas playlists, histórico, sessões narradas e DNA sonoro.'
                : 'Junte-se à nova era de streaming de áudio imersivo sem compressão.'}
            </p>
          </div>
        </div>

        {/* Abas Alternadoras: Entrar / Criar Conta */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 my-6">
          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              openAuthModal('login');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              authModalMode === 'login'
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                : 'text-text-muted hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              openAuthModal('signup');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              authModalMode === 'signup'
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                : 'text-text-muted hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Mensagem de Erro (se houver) */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-medium flex items-center gap-2 animate-shake">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Autenticação */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider pl-1">
                Nome de Ouvinte
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Ex: Victor Hugo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/10 focus:border-brand-purple/60 text-white text-xs placeholder:text-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider pl-1">
              E-mail
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-text-muted" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/10 focus:border-brand-purple/60 text-white text-xs placeholder:text-white/30 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider pl-1">
              Senha
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] border border-white/10 focus:border-brand-purple/60 text-white text-xs placeholder:text-white/30 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-text-muted hover:text-white transition-colors"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple via-purple-600 to-indigo-600 hover:from-brand-hover hover:to-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-brand-purple/25 hover:shadow-brand-purple/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Conectando...</span>
                </span>
              ) : (
                <>
                  <span>{authModalMode === 'login' ? 'Entrar no MooSic' : 'Criar Minha Conta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divisor */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-text-muted">
            <span className="bg-[#0B0C14] px-3">Ou acesse imediatamente</span>
          </div>
        </div>

        {/* Botão de Convidado VIP / Demonstração */}
        <button
          type="button"
          onClick={loginAsGuest}
          className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-light" />
          <span>Continuar como Convidado VIP</span>
        </button>

        {/* Garantia de Segurança */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sessão segura com áudio de alta precisão MooSic</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useRouter } from '@/app/routes/router';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/stores/authContext';

export const WelcomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none">
      <div className="w-20 h-20 bg-gradient-to-tr from-brand-purple to-fuchsia-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
        Sua identidade musical<br className="hidden sm:block" /> está quase pronta
      </h1>
      
      <p className="text-text-secondary text-base sm:text-lg max-w-lg mb-10">
        Bem-vindo ao MooSic, {user?.display_name || user?.username}. No futuro, criaremos sua cartografia sonora através de um onboarding completo. Por enquanto, seu perfil foi criado com sucesso.
      </p>

      <button
        onClick={() => navigate('/app')}
        className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        <span>Entrar na Plataforma</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

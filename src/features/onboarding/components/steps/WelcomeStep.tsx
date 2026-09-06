import React from 'react';
import { useOnboarding } from '../../stores/OnboardingContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const WelcomeStep: React.FC = () => {
  const { next, skipOnboarding } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 text-center max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light/10 border border-brand-light/20 mb-4">
          <Sparkles className="w-8 h-8 text-brand-light" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Antes de tocar qualquer coisa, <br/>
          <span className="text-brand-light">queremos conhecer seu som.</span>
        </h1>
        
        <p className="text-base sm:text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
          O MooSic vai criar uma experiência baseada nas suas escolhas. Não existe resposta certa. Quanto mais você nos contar, melhor será sua trilha sonora.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        <button
          onClick={next}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span>Começar</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={skipOnboarding}
          className="text-xs sm:text-sm font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors"
        >
          Pular por enquanto
        </button>
      </div>
    </div>
  );
};

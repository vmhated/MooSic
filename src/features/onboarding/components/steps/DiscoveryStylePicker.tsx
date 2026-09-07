import React from 'react';
import { useOnboarding } from '../../stores/OnboardingContext';
import { DiscoveryStyle } from '@/types/domain/taste';

interface StyleOption {
  id: DiscoveryStyle;
  label: string;
  subtitle: string;
  description: string;
  emoji: string;
}

const DISCOVERY_STYLES: StyleOption[] = [
  {
    id: 'familiar',
    label: 'Familiar',
    subtitle: 'O que já funciona pra mim',
    description: 'Quero ouvir o que já sei que gosto. Segurança e conforto no som.',
    emoji: '🎯',
  },
  {
    id: 'balanced',
    label: 'Equilibrado',
    subtitle: 'Novo, mas próximo do que eu gosto',
    description: 'Novidades existem, mas dentro da minha zona. Sem surpresas radicais.',
    emoji: '⚖️',
  },
  {
    id: 'explorer',
    label: 'Explorador',
    subtitle: 'Quero descobrir coisas novas',
    description: 'Leve-me para fora da minha bolha. Quero sons que eu nunca ouvi.',
    emoji: '🧭',
  },
  {
    id: 'niche_hunter',
    label: 'Caçador de Nichos',
    subtitle: 'Quanto mais raro, melhor',
    description: 'Artistas que a maioria ainda não conhece. Estou à frente da curva.',
    emoji: '🔭',
  },
];

export const DiscoveryStylePicker: React.FC = () => {
  const { draft, updateDraft, next, back } = useOnboarding();
  const selected = draft.discovery_style;

  const handleSelect = (styleId: DiscoveryStyle) => {
    updateDraft({ discovery_style: styleId });
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-4xl mx-auto p-6 sm:p-12 animate-fade-in pt-20 pb-32">
      {/* Header */}
      <div className="space-y-3 mb-12">
        <button onClick={back} className="text-xs text-text-muted font-bold uppercase tracking-widest hover:text-white transition-colors mb-4 flex items-center gap-2">
          ← Voltar
        </button>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          Como você prefere <span className="text-brand-light">descobrir música?</span>
        </h2>
        <p className="text-text-muted font-medium">
          Isso vai moldar como o MooSic te apresenta novas faixas.
        </p>
      </div>

      {/* Style Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DISCOVERY_STYLES.map((style) => {
          const isSelected = selected === style.id;
          return (
            <button
              key={style.id}
              onClick={() => handleSelect(style.id)}
              className={`text-left p-6 rounded-3xl border-2 transition-all duration-200 group ${
                isSelected
                  ? 'border-brand-light bg-brand-light/10 shadow-[0_0_30px_rgba(139,92,246,0.2)] scale-[1.02]'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06] hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-0.5 select-none">{style.emoji}</span>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-lg font-black tracking-tight ${isSelected ? 'text-white' : 'text-white'}`}>
                      {style.label}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-brand-light' : 'text-text-muted'}`}>
                    {style.subtitle}
                  </p>
                  <p className="text-xs text-text-muted/70 font-medium leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 bg-[#1A1B23] border border-white/10 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md">
          <button
            onClick={next}
            className={`px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
              selected
                ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
          >
            {selected ? 'Ver Meu Perfil' : 'Pular'}
          </button>
        </div>
      </div>
    </div>
  );
};

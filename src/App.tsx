import { useState } from 'react';
import { LandingPage } from '@/features/landing';
import { DesignSystemPlayground } from '@/features/playground/DesignSystemPlayground';
import { Layers, Home } from 'lucide-react';

/**
 * Shell Principal da Aplicação MooSic.
 * Renderiza a nova Landing Page por padrão, permitindo alternar para o Playground de validação de tokens e componentes.
 */
export default function App() {
  const [view, setView] = useState<'landing' | 'playground'>('landing');

  return (
    <div className="relative">
      {view === 'landing' ? <LandingPage /> : <DesignSystemPlayground />}

      {/* Floating Mode Switcher (para desenvolvedores validarem tokens vs nova landing) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setView(view === 'landing' ? 'playground' : 'landing')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-elevated/90 hover:bg-surface-elevated border border-surface-border text-xs font-semibold text-text-secondary hover:text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          title="Alternar entre Landing Page e Playground de Tokens"
        >
          {view === 'landing' ? (
            <>
              <Layers className="w-3.5 h-3.5 text-brand-purple" />
              <span>Design System Playground</span>
            </>
          ) : (
            <>
              <Home className="w-3.5 h-3.5 text-brand-purple" />
              <span>Voltar para Landing Page</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


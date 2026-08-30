import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { brandSound } from '@/utils/audio/brandSoundDesign';

interface BrandIntroProps {
  onComplete: () => void;
}

export const BrandIntro: React.FC<BrandIntroProps> = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Fases com timing equilibrado e centralização óptica exata:
  // 1: 'name-reveal'     (0.0s - 1.6s) -> Nome "MooSic" centralizado com "oo" destacados
  // 2: 'infinity-loading'(1.6s - 3.8s) -> O infinito desliza para o centro exato da tela como indicador de carregamento
  // 3: 'resolved'        (3.8s - 4.5s) -> Conclusão suave e dissolução para a Landing Page
  const [phase, setPhase] = useState<'name-reveal' | 'infinity-loading' | 'resolved'>(
    shouldReduceMotion ? 'resolved' : 'name-reveal'
  );

  const handleUserGesture = () => {
    setHasInteracted(true);
    brandSound.init();
    if (phase === 'name-reveal') {
      brandSound.playNameEntrySound();
    } else if (phase === 'infinity-loading') {
      brandSound.playInfinityLoadingSound();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUserGesture();
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    brandSound.setMuted(nextState);
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      const quickTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(quickTimer);
    }

    // 1. Som de entrada do nome MooSic
    const t0 = setTimeout(() => {
      brandSound.playNameEntrySound();
    }, 200);

    // 2. Os O's viram o infinito e centralizam
    const t1 = setTimeout(() => {
      setPhase('infinity-loading');
      brandSound.playInfinityLoadingSound();
    }, 1600);

    // 3. Conclusão do carregamento e transição
    const t2 = setTimeout(() => {
      setPhase('resolved');
      brandSound.playPlatformRevealSound();
    }, 3800);

    const t3 = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [shouldReduceMotion, onComplete]);

  // Modo com movimento reduzido
  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl select-none"
      >
        <div className="flex items-center justify-center font-brand font-black text-6xl sm:text-7xl lg:text-8xl text-white tracking-tight">
          <span>M</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand-purple to-indigo-400">
            oo
          </span>
          <span>Sic</span>
        </div>
      </motion.div>
    );
  }

  const isNamePhase = phase === 'name-reveal';
  const isLoadingPhase = phase === 'infinity-loading';

  return (
    <AnimatePresence>
      {phase !== 'resolved' && (
        <motion.div
          key="brand-intro-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background select-none overflow-hidden cursor-pointer"
          onClick={handleUserGesture}
          aria-label="MooSic Abertura e Carregamento de Marca"
        >
          {/* Fundo com iluminação aveludada */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090611] via-[#0d091a] to-[#090611] pointer-events-none" />

          {/* Botão de Som no Canto Superior */}
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-xs font-semibold text-text-secondary hover:text-white backdrop-blur-xl transition-all shadow-md active:scale-95"
              aria-label="Alternar áudio imersivo"
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-text-muted" />
                  <span className="text-xs">Som desativado</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-brand-purple animate-pulse" />
                  <span className="text-xs text-white font-bold">Áudio Imersivo Ativo</span>
                </>
              )}
            </button>
          </div>

          {/* Dica de interação */}
          {!hasInteracted && (
            <motion.div
              className="absolute bottom-10 inset-x-0 mx-auto w-fit flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-xs text-text-secondary backdrop-blur-xl z-30 pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-purple animate-pulse" />
              <span>Toque ou clique na tela para amplificar o som</span>
            </motion.div>
          )}

          {/* Ambient Radial Glow Centralizado */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(99,102,241,0.08) 45%, transparent 75%)',
            }}
            animate={{
              scale: isLoadingPhase ? [1, 1.15, 1] : 1,
              opacity: isLoadingPhase ? 0.4 : 0.3,
            }}
            transition={{
              duration: 2.2,
              repeat: isLoadingPhase ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />

          {/* PALCO CENTRAL PERFEITAMENTE EQUILIBRADO */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 min-h-[260px]">
            
            {/* 1. FASE DE NOME: MOOSIC */}
            {isNamePhase && (
              <motion.div
                key="name-stage"
                className="flex items-center justify-center font-brand font-black text-6xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>M</span>

                <div className="relative flex items-center justify-center w-28 sm:w-36 lg:w-44 h-14 sm:h-18 lg:h-22 mx-1 sm:mx-2">
                  <svg viewBox="0 0 200 100" fill="none" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="loadOgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F472B6" />
                        <stop offset="35%" stopColor="#C084FC" />
                        <stop offset="70%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <g>
                      {/* Círculo Esquerdo 'O' */}
                      <circle
                        cx="54"
                        cy="50"
                        r="30"
                        stroke="url(#loadOgGrad)"
                        strokeWidth="15"
                      />
                      <circle cx="54" cy="50" r="18" fill="rgba(255,255,255,0.06)" />

                      {/* Círculo Direito 'O' */}
                      <circle
                        cx="146"
                        cy="50"
                        r="30"
                        stroke="url(#loadOgGrad)"
                        strokeWidth="15"
                      />
                      <circle cx="146" cy="50" r="18" fill="rgba(255,255,255,0.06)" />
                    </g>
                  </svg>
                </div>

                <span>Sic</span>
              </motion.div>
            )}

            {/* 2. FASE DE CARREGAMENTO: INFINITO 100% CENTRALIZADO */}
            {isLoadingPhase && (
              <motion.div
                key="loading-stage"
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative flex items-center justify-center w-36 sm:w-44 lg:w-52 h-18 sm:h-22 lg:h-26">
                  <svg viewBox="0 0 200 100" fill="none" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="infiniteLoadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F472B6" />
                        <stop offset="35%" stopColor="#C084FC" />
                        <stop offset="70%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>

                    {/* 1. Trilha Base do Infinito */}
                    <path
                      d="M 100 50 C 122 18, 172 18, 172 50 C 172 82, 122 82, 100 50 C 78 18, 28 18, 28 50 C 28 82, 78 82, 100 50 Z"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* 2. Feixe de Luz de Carregamento Contínuo */}
                    <motion.path
                      d="M 100 50 C 122 18, 172 18, 172 50 C 172 82, 122 82, 100 50 C 78 18, 28 18, 28 50 C 28 82, 78 82, 100 50 Z"
                      stroke="url(#infiniteLoadGrad)"
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0.35, pathOffset: 0 }}
                      animate={{
                        pathOffset: [0, 1],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* Subtitle / Indicador de Carregamento Centralizado */}
            <motion.div
              className="mt-8 text-center"
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isNamePhase ? (
                <span className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.3em] text-text-secondary">
                  Onde a música nunca tem fim
                </span>
              ) : (
                <div className="flex items-center justify-center gap-2.5 text-xs font-sans font-medium text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                  <span className="tracking-wider uppercase text-[11px] text-brand-light font-bold">
                    Carregando Experiência Sonora...
                  </span>
                </div>
              )}
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

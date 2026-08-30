import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface BrandIntroProps {
  onComplete: () => void;
}

export const BrandIntro: React.FC<BrandIntroProps> = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();

  // Intro narrative phases with generous, cinematic pacing:
  // 'initial'   (0.00s - 0.25s) -> Soft background activation
  // 'approach'  (0.25s - 1.40s) -> Two physical O's glide in with silky momentum
  // 'converge'  (1.40s - 1.95s) -> Circles meet and fuse softly at center
  // 'morph'     (1.95s - 2.50s) -> Forms the continuous bold Lemniscate ∞
  // 'settle'    (2.50s - 4.20s) -> Tight M(∞)Sic illuminates, grows in scale & tagline appears
  // 'exit'      (4.20s - 5.00s) -> Silky dissolve into the active landing page
  const [phase, setPhase] = useState<
    'initial' | 'approach' | 'converge' | 'morph' | 'settle' | 'exit'
  >(shouldReduceMotion ? 'exit' : 'initial');

  useEffect(() => {
    if (shouldReduceMotion) {
      const quickTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(quickTimer);
    }

    const t1 = setTimeout(() => setPhase('approach'), 200);
    const t2 = setTimeout(() => setPhase('converge'), 1400);
    const t3 = setTimeout(() => setPhase('morph'), 1950);
    const t4 = setTimeout(() => setPhase('settle'), 2500);
    const t5 = setTimeout(() => setPhase('exit'), 4200);
    const t6 = setTimeout(() => onComplete(), 4950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [shouldReduceMotion, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="brand-intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md select-none overflow-hidden"
          aria-label="MooSic Brand Introduction"
        >
          {/* Vibrant Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-purple/20 blur-[160px] pointer-events-none" />

          {/* Central Animation Stage */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] w-full max-w-2xl px-4">
            
            {/* ========================================================= */}
            {/* 1. THE TWO SEPARATE O'S (Approach & Soft Convergence) */}
            {/* ========================================================= */}
            {(phase === 'initial' || phase === 'approach' || phase === 'converge') && (
              <div className="relative flex items-center justify-center w-full h-40">
                {/* Left Circle "O" */}
                <motion.div
                  className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[5px] border-brand-purple shadow-[0_0_25px_rgba(139,92,246,0.6)]"
                  initial={{ x: -260, y: -6, opacity: 0.8 }}
                  animate={
                    phase === 'initial'
                      ? { x: -260, y: -6, opacity: 0.8 }
                      : phase === 'approach'
                      ? { x: -20, y: 0, opacity: 1 }
                      : { x: -14, y: 0, opacity: 1 }
                  }
                  transition={{
                    duration: phase === 'converge' ? 0.45 : 1.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />

                {/* Right Circle "O" */}
                <motion.div
                  className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[5px] border-brand-purple shadow-[0_0_25px_rgba(139,92,246,0.6)]"
                  initial={{ x: 260, y: 6, opacity: 0.8 }}
                  animate={
                    phase === 'initial'
                      ? { x: 260, y: 6, opacity: 0.8 }
                      : phase === 'approach'
                      ? { x: 20, y: 0, opacity: 1 }
                      : { x: 14, y: 0, opacity: 1 }
                  }
                  transition={{
                    duration: phase === 'converge' ? 0.45 : 1.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. TIGHT, BOLD & LUMINOUS M(∞)Sic COMPOSITION */}
            {/* ========================================================= */}
            {(phase === 'morph' || phase === 'settle') && (
              <motion.div
                className="flex flex-col items-center justify-center gap-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: phase === 'settle' ? 1.2 : 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Master Wordmark Container: Tight Kerning M + [∞] + Sic */}
                <div className="flex items-center justify-center tracking-tight select-none drop-shadow-[0_0_35px_rgba(139,92,246,0.6)]">
                  {/* Bold Letter "M" */}
                  <motion.span
                    className="font-brand font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tighter"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{
                      opacity: phase === 'settle' ? 1 : 0,
                      x: phase === 'settle' ? 0 : 24,
                    }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  >
                    M
                  </motion.span>

                  {/* Luminous Central Infinity Symbol as the two "oo"s */}
                  <motion.div
                    className="relative flex items-center justify-center w-20 sm:w-28 lg:w-32 h-12 sm:h-16 lg:h-20 mx-0.5 sm:mx-1"
                    animate={{
                      scale: phase === 'settle' ? [1, 1.03, 1] : 1,
                    }}
                    transition={{
                      scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  >
                    <svg viewBox="0 0 200 100" fill="none" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="introInfinityGlow" x1="0%" y1="50%" x2="100%" y2="50%">
                          <stop offset="0%" stopColor="#C084FC" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#D8B4FE" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M 100 50 C 122 20, 168 20, 168 50 C 168 80, 122 80, 100 50 C 78 20, 32 20, 32 50 C 32 80, 78 80, 100 50 Z"
                        stroke="url(#introInfinityGlow)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0.8, opacity: 0.8 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                  </motion.div>

                  {/* Bold Suffix "Sic" */}
                  <motion.span
                    className="font-brand font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tighter"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{
                      opacity: phase === 'settle' ? 1 : 0,
                      x: phase === 'settle' ? 0 : -24,
                    }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Sic
                  </motion.span>
                </div>

                {/* Symmetrical & Centered Tagline */}
                {phase === 'settle' && (
                  <motion.div
                    className="w-full flex items-center justify-center text-center pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
                  >
                    <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[0.25em] text-text-secondary">
                      Where music never ends
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

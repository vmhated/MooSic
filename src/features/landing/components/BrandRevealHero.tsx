import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Play, Sparkles, ArrowRight, Music2, Disc3 } from 'lucide-react';
import { LivingInfinity } from './LivingInfinity';

interface BrandRevealHeroProps {
  onExploreClick?: () => void;
  activeAccentColor?: string;
}

export const BrandRevealHero: React.FC<BrandRevealHeroProps> = ({
  onExploreClick,
  activeAccentColor = '#8B5CF6',
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Animation timeline state:
  // 'initial' -> 'approaching' -> 'merging' -> 'revealed'
  const [animationStage, setAnimationStage] = useState<'initial' | 'approaching' | 'merging' | 'revealed'>(
    shouldReduceMotion ? 'revealed' : 'initial'
  );

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Sequence the brand reveal seamlessly
    const timer1 = setTimeout(() => setAnimationStage('approaching'), 400);
    const timer2 = setTimeout(() => setAnimationStage('merging'), 1600);
    const timer3 = setTimeout(() => setAnimationStage('revealed'), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [shouldReduceMotion]);

  const handleReplay = () => {
    if (shouldReduceMotion) return;
    setAnimationStage('initial');
    setTimeout(() => setAnimationStage('approaching'), 300);
    setTimeout(() => setAnimationStage('merging'), 1400);
    setTimeout(() => setAnimationStage('revealed'), 2200);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-start pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center select-none">
      {/* Background Dynamic Light Atmosphere */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-25 transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse at top, ${activeAccentColor} 0%, rgba(139, 92, 246, 0.15) 50%, transparent 80%)`,
        }}
      />

      {/* Subtle Grid Ambient Texture */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#19192415_1px,transparent_1px),linear-gradient(to_bottom,#19192415_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
      />

      {/* TOP BRAND REVEAL CANVASES */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[170px] mb-4">
        <AnimatePresence mode="wait">
          {animationStage !== 'revealed' ? (
            /* BRAND REVEAL STAGE 1 & 2: The Two O's Approaching & Merging */
            <motion.div
              key="approaching-stage"
              className="relative flex items-center justify-center w-full max-w-md h-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            >
              {/* Left "O" */}
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{ x: -120, opacity: 0.2, scale: 0.85 }}
                animate={
                  animationStage === 'initial'
                    ? { x: -120, opacity: 0.35, scale: 0.9 }
                    : animationStage === 'approaching'
                    ? { x: -28, opacity: 0.95, scale: 1.05 }
                    : { x: -14, opacity: 1, scale: 1.1 }
                }
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[4px] border-brand-purple shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/60 animate-ping" />
                </div>
              </motion.div>

              {/* Central Energy Spark when meeting */}
              {animationStage === 'merging' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-full bg-brand-purple/40 blur-md z-10"
                />
              )}

              {/* Right "O" */}
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{ x: 120, opacity: 0.2, scale: 0.85 }}
                animate={
                  animationStage === 'initial'
                    ? { x: 120, opacity: 0.35, scale: 0.9 }
                    : animationStage === 'approaching'
                    ? { x: 28, opacity: 0.95, scale: 1.05 }
                    : { x: 14, opacity: 1, scale: 1.1 }
                }
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[4px] border-brand-purple shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/60 animate-ping" />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* BRAND REVEAL STAGE 3 & 4: Living ∞ + MooSic Wordmark */
            <motion.div
              key="infinity-stage"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              onClick={handleReplay}
              title="Clique para reviver o gesto de marca"
            >
              <LivingInfinity size={110} glowColor={activeAccentColor} />

              {/* Brand Wordmark in Manrope */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center tracking-tight"
              >
                <span className="font-brand font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  M<span className="text-brand-purple tracking-tight">oo</span>Sic
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HERO HEADLINE & COPY */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-6"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Concept Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated/80 border border-surface-border backdrop-blur-md text-xs font-medium text-text-secondary shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
          <span>O + O → ∞ • Fluxo e Descoberta Contínua</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-sans text-white tracking-tight leading-[1.1]">
          Music that <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D8B4FE] to-brand-purple">moves with you.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-sans font-normal leading-relaxed">
          Uma experiência musical viva e sem barreiras. Onde cada faixa é uma ponte para a próxima descoberta infinita.
        </p>

        {/* Hero CTA & Quick Actions */}
        <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={onExploreClick}
            className="w-full sm:w-auto text-base px-8 py-3.5 shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_45px_rgba(139,92,246,0.6)] group"
          >
            Start listening
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Button>

          <a
            href="#carousel-discovery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-white px-5 py-3 rounded-xl transition-colors hover:bg-surface-elevated/50"
          >
            <Disc3 className="w-4 h-4 text-brand-purple animate-spin-slow" />
            Explorar Artworks
          </a>
        </div>
      </motion.div>

      {/* Decorative Sound Wave subtle indicator */}
      <motion.div
        className="relative z-10 mt-12 flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
      >
        <Music2 className="w-4 h-4 text-brand-purple mr-1" />
        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Infinite Sound Flow</span>
      </motion.div>
    </section>
  );
};

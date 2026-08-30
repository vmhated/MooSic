import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Play, Sparkles, ArrowUpRight } from 'lucide-react';

interface FinalCTASectionProps {
  onStartClick?: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onStartClick }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden text-center select-none"
      aria-label="Convite para o MooSic"
    >
      {/* Background Volumetric Aura */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[190px] pointer-events-none opacity-25 -z-10"
        style={{
          background: `radial-gradient(circle at center, #8B5CF6 0%, transparent 75%)`,
        }}
      />

      {/* Main Glassmorphic CTA Card */}
      <motion.div
        className="max-w-4xl mx-auto rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-3xl p-8 sm:p-14 space-y-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)]"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand Infinity Monogram */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-xs font-black uppercase tracking-wider text-brand-light shadow-glow">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
          <span>Onde a música nunca para</span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-sans text-white tracking-tighter uppercase leading-[0.95]">
          Entre no <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-light to-brand-purple drop-shadow-md">
            fluxo do infinito.
          </span>
        </h2>

        {/* Value Proposition em Português */}
        <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed max-w-xl mx-auto">
          Áudio de estúdio de 24 bits sem perdas, atmosfera visual que acompanha cada batida e mais de 100 milhões de faixas para explorar.
        </p>

        {/* Glassmorphic Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={onStartClick}
            className="text-base px-8 py-4 font-black shadow-glow hover:shadow-glow-lg"
          >
            Começar a ouvir agora
          </Button>

          <Button
            variant="glass"
            size="lg"
            rightIcon={<ArrowUpRight className="w-4 h-4 text-brand-light" />}
            onClick={() => {
              const el = document.getElementById('discover');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-base px-7 py-4 font-bold"
          >
            Explorar catálogo
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

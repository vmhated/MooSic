import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Play, ArrowRight } from 'lucide-react';
import { LivingInfinity } from './LivingInfinity';

interface FinalCTASectionProps {
  onStartClick?: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onStartClick }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-28 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto text-center select-none overflow-hidden">
      {/* Background Graphic Wash */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-brand-purple/15 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center space-y-8"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Living Infinity Motif */}
        <div className="mb-2">
          <LivingInfinity size={90} glowColor="#8B5CF6" glowOpacity={0.3} />
        </div>

        {/* Closing Narrative Manifesto */}
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-sans text-white tracking-tighter uppercase leading-[0.95]">
          Music never <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-primary to-brand-purple">
            stops.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-text-secondary max-w-lg mx-auto font-sans leading-relaxed">
          Entre no universo MooSic e descubra uma nova forma de se conectar com cada melodia, ritmo e palavra.
        </p>

        {/* Final CTA Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={onStartClick}
            className="text-base px-8 py-4 font-bold shadow-glow hover:shadow-glow-lg group"
          >
            Start listening now
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

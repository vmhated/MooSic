import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Radio, Activity } from 'lucide-react';
import { LivingInfinity } from './LivingInfinity';

export const StoryMovement: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Equalizer bar heights
  const bars = [40, 75, 55, 90, 60, 85, 45, 100, 70, 50, 95, 65, 80, 40];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Narrative Copy */}
        <motion.div
          className="lg:col-span-6 space-y-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-elevated border border-surface-border text-xs font-semibold text-brand-light">
            <Radio className="w-3.5 h-3.5 text-brand-purple animate-pulse" />
            <span>STORY 01 • RESSONÂNCIA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight leading-tight">
            Music that moves with you.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed">
            A música não é estática. A interface do MooSic respira no mesmo compasso da sua audição: a atmosfera visual, os tons luminosos e a pulsação do infinito respondem diretamente à energia da sua música.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-border">
            <div className="space-y-1">
              <span className="text-2xl font-bold font-sans text-white">Lossless</span>
              <p className="text-xs text-text-muted">Áudio em alta fidelidade pura</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold font-sans text-brand-light">Dynamic</span>
              <p className="text-xs text-text-muted">Atmosfera gerada pelo som</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Visual Living Motion Canvas */}
        <motion.div
          className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-3xl bg-surface-elevated/60 border border-surface-border backdrop-blur-xl relative"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Central Living Infinity */}
          <div className="my-8">
            <LivingInfinity size={160} glowColor="#8B5CF6" glowOpacity={0.5} />
          </div>

          {/* Symmetrical Sound Wave Reactive Bars */}
          <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-sm pt-4">
            {bars.map((height, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-brand-purple/40 via-brand-purple to-brand-light"
                animate={
                  shouldReduceMotion
                    ? { height: `${height * 0.6}%` }
                    : {
                        height: [`${height * 0.3}%`, `${height}%`, `${height * 0.4}%`],
                      }
                }
                transition={{
                  duration: 1.2 + (i % 5) * 0.2,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-6 text-xs text-text-muted">
            <Activity className="w-3.5 h-3.5 text-brand-purple" />
            <span>Frequência em tempo real • 48 kHz / 24-Bit</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

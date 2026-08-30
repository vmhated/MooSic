import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, Infinity as InfinityIcon, Zap, Disc3 } from 'lucide-react';
import { MOCK_HERO_TRACKS } from '../data/mockMusicData';

export const StoryDiscovery: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Dynamic Background Ambient Light */}
      <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[300px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-elevated border border-surface-border text-xs font-semibold text-brand-light">
          <Compass className="w-3.5 h-3.5 text-brand-purple" />
          <span>STORY 03 • EXPLORAÇÃO</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight leading-tight">
          Discover without limits.
        </h2>

        <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed">
          O conceito do infinito guia todo o ecossistema do MooSic: sem algoritmos engessados ou barreiras. Seu gosto musical expande-se organicamente através de conexões sonoras naturais.
        </p>
      </div>

      {/* Discovery Flow Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature Card 1: Infinite Smart Queue */}
        <motion.div
          className="p-6 rounded-3xl bg-surface-elevated/70 border border-surface-border backdrop-blur-md space-y-4 hover:border-brand-purple/40 transition-colors"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
            <InfinityIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-sans text-white">Fluxo Contínuo Infinito</h3>
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            Quando sua playlist termina, a música nunca silencia. O MooSic tece uma sequência contínua com faixas que compartilham o mesmo DNA sonoro.
          </p>
        </motion.div>

        {/* Feature Card 2: High Resolution Engine */}
        <motion.div
          className="p-6 rounded-3xl bg-surface-elevated/70 border border-surface-border backdrop-blur-md space-y-4 hover:border-brand-purple/40 transition-colors"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-sans text-white">Pureza de Áudio 24-Bit</h3>
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            Experimente cada camada, reverberação e instrumento com clareza cristalina sem compressões destrutivas.
          </p>
        </motion.div>

        {/* Feature Card 3: Dynamic Mood Atmosphere */}
        <motion.div
          className="p-6 rounded-3xl bg-surface-elevated/70 border border-surface-border backdrop-blur-md space-y-4 hover:border-brand-purple/40 transition-colors"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
            <Disc3 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-sans text-white">Atmosfera por Artwork</h3>
          <p className="text-sm text-text-secondary font-sans leading-relaxed">
            Cada capa transforma a estética da sua tela em uma galeria imersiva com luzes ambientes sob medida.
          </p>
        </motion.div>
      </div>

      {/* Floating mini track strip demo */}
      <div className="mt-12 p-4 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-between gap-4 overflow-x-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted shrink-0">
          Recomendados em Tempo Real:
        </span>
        <div className="flex items-center gap-3 shrink-0">
          {MOCK_HERO_TRACKS.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-background border border-surface-border text-xs"
            >
              <img src={t.artwork} alt={t.title} className="w-6 h-6 rounded-md object-cover" />
              <span className="font-semibold text-white truncate max-w-[100px]">{t.title}</span>
              <span className="text-text-muted">•</span>
              <span className="text-text-secondary truncate max-w-[90px]">{t.artist}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

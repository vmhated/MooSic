import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlignLeft, Mic2, Sparkles } from 'lucide-react';
import { MOCK_HERO_TRACKS } from '../data/mockMusicData';

export const StoryLyrics: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const sampleTrack = MOCK_HERO_TRACKS[0];
  const [activeLine, setActiveLine] = useState(1);

  // Cycle through active lyric lines automatically
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % (sampleTrack.lyricsSnippet?.length || 4));
    }, 3500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion, sampleTrack.lyricsSnippet?.length]);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Dynamic Background Light */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-purple/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Visual Lyrics Sheet */}
        <motion.div
          className="lg:col-span-6 order-2 lg:order-1 p-6 sm:p-8 rounded-3xl bg-surface-elevated/70 border border-surface-border backdrop-blur-xl relative overflow-hidden"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Card Header with Track Meta */}
          <div className="flex items-center justify-between pb-6 border-b border-surface-border/80">
            <div className="flex items-center gap-3">
              <img
                src={sampleTrack.artwork}
                alt={sampleTrack.title}
                className="w-12 h-12 rounded-xl object-cover border border-surface-border shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-white font-sans">{sampleTrack.title}</h4>
                <p className="text-xs text-text-secondary font-sans">{sampleTrack.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-[11px] font-semibold text-brand-light">
              <Mic2 className="w-3 h-3 text-brand-purple" />
              <span>Letras Vivas</span>
            </div>
          </div>

          {/* Flowing Lyrics Snippets */}
          <div className="py-8 space-y-5">
            {sampleTrack.lyricsSnippet?.map((line, idx) => {
              const isActive = idx === activeLine;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveLine(idx)}
                  className={`cursor-pointer transition-all duration-300 select-none ${
                    isActive
                      ? 'text-white text-xl sm:text-2xl font-bold font-sans'
                      : 'text-text-muted hover:text-text-secondary text-base sm:text-lg font-medium font-sans'
                  }`}
                  animate={{
                    scale: isActive ? 1.02 : 0.98,
                    x: isActive ? 8 : 0,
                    opacity: isActive ? 1 : 0.45,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono text-brand-purple/70 w-8 shrink-0">
                      {line.time}
                    </span>
                    <span className="leading-snug">{line.text}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer of Lyrics Card */}
          <div className="pt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              Sincronização milissegundo a milissegundo
            </span>
            <span className="font-mono">LRC Real-Time</span>
          </div>
        </motion.div>

        {/* Right Column: Narrative Copy */}
        <motion.div
          className="lg:col-span-6 order-1 lg:order-2 space-y-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-elevated border border-surface-border text-xs font-semibold text-brand-light">
            <AlignLeft className="w-3.5 h-3.5 text-brand-purple" />
            <span>STORY 02 • NARRATIVA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight leading-tight">
            Every song has a story.
          </h2>

          <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed">
            Mergulhe nas palavras com letras que fluem no tempo exato da melodia. Cada verso ganha destaque no momento em que a voz toca o coração, transformando a música em poesia visual.
          </p>

          <ul className="space-y-3 pt-2 text-sm text-text-secondary">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-purple" />
              <span>Destaque inteligente da linha ativa com transição fluida</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-purple" />
              <span>Navegação instantânea: toque em qualquer verso para saltar no áudio</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-purple" />
              <span>Visualização limpa e livre de distrações</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

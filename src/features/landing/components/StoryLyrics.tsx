import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mic2 } from 'lucide-react';
import { Track } from '@/types/domain/music';

interface StoryLyricsProps {
  currentTrack: Track;
}

export const StoryLyrics: React.FC<StoryLyricsProps> = ({ currentTrack }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeLine, setActiveLine] = useState(1);

  const lyricsList = currentTrack.lyricsSnippet && currentTrack.lyricsSnippet.length > 0
    ? currentTrack.lyricsSnippet
    : [
        { time: '0:14', text: 'Lost in the frequency of endless sound' },
        { time: '0:28', text: 'Where echoes meet the morning ground', highlight: true },
        { time: '0:42', text: 'Drifting further than we used to know' },
        { time: '0:56', text: 'Caught inside the infinite flow' },
      ];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % lyricsList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion, lyricsList.length]);

  return (
    <section
      id="lyrics"
      className="relative py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Section Marker */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-bold text-brand-purple">03</span>
        <span className="h-[1px] w-6 bg-brand-purple" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Synchronized Lyrics
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Massive Editorial Lyrics Sheet */}
        <motion.div
          className="lg:col-span-7 order-2 lg:order-1 p-8 sm:p-12 rounded-3xl bg-surface-elevated/80 border border-surface-border backdrop-blur-xl shadow-2xl space-y-8"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header of Lyrics Sheet */}
          <div className="flex items-center justify-between pb-6 border-b border-surface-border/60">
            <div className="flex items-center gap-4">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-14 h-14 rounded-2xl object-cover border border-surface-border shadow-md"
              />
              <div className="min-w-0">
                <h4 className="text-lg font-bold text-white font-sans truncate">{currentTrack.title}</h4>
                <p className="text-xs text-text-secondary font-sans truncate">{currentTrack.artistName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-xs font-semibold text-brand-light">
              <Mic2 className="w-3.5 h-3.5 text-brand-purple" />
              <span>Letras Vivas</span>
            </div>
          </div>

          {/* Massive Typography Verses */}
          <div className="space-y-8 py-4">
            {lyricsList.map((line, idx) => {
              const isActive = idx === activeLine;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveLine(idx)}
                  className={`cursor-pointer transition-all duration-300 select-none ${
                    isActive
                      ? 'text-white text-2xl sm:text-4xl font-extrabold font-sans tracking-tight'
                      : 'text-text-muted hover:text-text-secondary text-lg sm:text-2xl font-semibold font-sans opacity-30 hover:opacity-70'
                  }`}
                  animate={{
                    x: isActive ? 10 : 0,
                    scale: isActive ? 1.02 : 0.98,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-brand-purple w-10 shrink-0 font-medium">
                      {line.time}
                    </span>
                    <span className="leading-snug">{line.text}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-text-muted">
            <span>Toque em qualquer verso para saltar no áudio</span>
            <span>Áudio Hi-Fi</span>
          </div>
        </motion.div>

        {/* Right Column: Editorial Copy */}
        <motion.div
          className="lg:col-span-5 order-1 lg:order-2 space-y-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans text-white tracking-tight uppercase leading-[0.98]">
            Every song <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-primary to-brand-purple">
              has a story.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed">
            Mergulhe nas palavras com letras que respiram no tempo exato da melodia. Tipografia de alto impacto para acompanhar cada verso com clareza cristalina.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

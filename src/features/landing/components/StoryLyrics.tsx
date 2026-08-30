import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mic2, Sparkles, Music2, Waves, ChevronUp, ChevronDown } from 'lucide-react';
import { Track } from '@/types/domain/music';
import { useLyrics } from '@/hooks/useLyrics';

interface StoryLyricsProps {
  currentTrack: Track;
}

export const StoryLyrics: React.FC<StoryLyricsProps> = ({ currentTrack }) => {
  const shouldReduceMotion = useReducedMotion();
  const { lines, isRealSynced, loading, hasLyrics } = useLyrics(currentTrack);
  const [activeLine, setActiveLine] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const accentColor = currentTrack.accent || '#8B5CF6';

  // Reseta a linha ativa sempre que a faixa mudar
  useEffect(() => {
    setActiveLine(0);
    setIsPaused(false);
  }, [currentTrack.id]);

  // Efeito de rolagem automática suave das letras (karaokê)
  useEffect(() => {
    if (shouldReduceMotion || lines.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % lines.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, lines.length, isPaused, currentTrack.id]);

  const handleNextLine = () => {
    if (lines.length === 0) return;
    setActiveLine((prev) => (prev + 1) % lines.length);
  };

  const handlePrevLine = () => {
    if (lines.length === 0) return;
    setActiveLine((prev) => (prev - 1 + lines.length) % lines.length);
  };

  return (
    <section
      id="lyrics"
      className="relative py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Dynamic Ambient Background Wash */}
      <motion.div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[450px] rounded-full blur-[170px] pointer-events-none opacity-20 transition-colors duration-700 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 75%)`,
        }}
      />

      {/* Section Marker */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-black text-brand-purple">03</span>
        <span className="h-[1px] w-6 bg-brand-purple" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-light bg-white/[0.05] px-3 py-1 rounded-full border border-white/10">
          Letras Sincronizadas
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Massive Editorial Lyrics Sheet with Smooth Mask Dissolve */}
        <motion.div
          className="lg:col-span-7 order-2 lg:order-1 p-6 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header of Lyrics Sheet */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 gap-4 flex-wrap">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 min-w-[56px] min-h-[56px] aspect-square rounded-2xl overflow-hidden border border-white/15 shadow-md bg-surface shrink-0">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover object-center aspect-square"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg font-black text-white font-sans truncate">{currentTrack.title}</h4>
                <p className="text-xs text-text-secondary font-sans truncate font-medium">{currentTrack.artistName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-xs font-bold text-brand-light">
                {loading ? (
                  <span>Sincronizando letras...</span>
                ) : isRealSynced ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Letra Sincronizada (LRCLIB)</span>
                  </>
                ) : hasLyrics ? (
                  <>
                    <Mic2 className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Letras Vivas</span>
                  </>
                ) : (
                  <>
                    <Music2 className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Modo Instrumental</span>
                  </>
                )}
              </div>

              {hasLyrics && lines.length > 1 && (
                <div className="flex items-center gap-1 bg-white/[0.06] border border-white/10 rounded-xl p-0.5 backdrop-blur-md">
                  <button
                    onClick={handlePrevLine}
                    className="p-1 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                    aria-label="Verso anterior"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextLine}
                    className="p-1 rounded-lg hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                    aria-label="Próximo verso"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Continuous Sliding Lyrics Viewport with Top & Bottom Dissolve Mask */}
          {hasLyrics && lines.length > 0 ? (
            <div
              className="relative h-[320px] overflow-hidden select-none"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
              }}
            >
              <motion.div
                className="space-y-4 py-8"
                animate={shouldReduceMotion ? {} : { y: -(activeLine * 68) + 100 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 24,
                  mass: 0.8,
                }}
              >
                {lines.map((line, idx) => {
                  const isActive = idx === activeLine;
                  const distance = Math.abs(idx - activeLine);

                  return (
                    <motion.div
                      key={`${currentTrack.id}-${idx}`}
                      onClick={() => setActiveLine(idx)}
                      className={`cursor-pointer transition-all duration-300 py-1.5 rounded-2xl px-2.5 ${
                        isActive
                          ? 'bg-white/[0.08] backdrop-blur-md shadow-sm border border-white/10'
                          : 'hover:bg-white/[0.03]'
                      }`}
                      animate={{
                        opacity: isActive ? 1 : Math.max(0.18, 0.65 - distance * 0.22),
                        scale: isActive ? 1.04 : 0.97,
                        filter: isActive ? 'blur(0px)' : distance > 2 ? 'blur(1.5px)' : 'blur(0px)',
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`text-xs font-mono font-black w-12 shrink-0 transition-colors ${
                            isActive ? 'text-brand-purple' : 'text-text-muted'
                          }`}
                        >
                          {line.time}
                        </span>

                        <span
                          className={`leading-snug transition-all ${
                            isActive
                              ? 'text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-light drop-shadow-md'
                              : distance === 1
                              ? 'text-lg sm:text-xl font-bold font-sans text-text-secondary'
                              : 'text-base sm:text-lg font-medium font-sans text-text-muted'
                          }`}
                        >
                          {line.text}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ) : (
            /* Elegant Instrumental Mode */
            <div className="py-10 px-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-purple shadow-glow">
                <Waves className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-xl font-black text-white font-sans">
                  Experiência Sonora Pura
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary font-sans leading-relaxed">
                  Esta faixa é instrumental ou suas letras estão em processo de catalogação. Deixe a melodia de <strong className="text-white">{currentTrack.title}</strong> conduzir a sua atmosfera.
                </p>
              </div>
              {/* Animated resonance equalizer */}
              <div className="flex items-end justify-center gap-1.5 h-10 pt-2">
                {[30, 65, 45, 85, 55, 95, 40, 100, 60, 45, 75, 35, 70, 50].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full transition-colors duration-700"
                    style={{ backgroundColor: accentColor }}
                    animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
                    transition={{
                      duration: 1.2 + (i % 4) * 0.2,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                      delay: i * 0.04,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer of the Lyrics Box */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-muted font-medium">
            <span>
              {hasLyrics && lines.length > 0
                ? isPaused
                  ? 'Pausado (navegue com o mouse ou toque)'
                  : 'Sincronização ao vivo ativa'
                : 'Áudio Hi-Res Lossless 24-Bit'}
            </span>
            <span>Áudio de Alta Resolução</span>
          </div>
        </motion.div>

        {/* Right Column: Editorial Copy em Português */}
        <motion.div
          className="lg:col-span-5 order-1 lg:order-2 space-y-6 text-left"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans text-white tracking-tight uppercase leading-[0.98]">
            Toda música <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-light to-brand-purple drop-shadow-md">
              carrega uma história.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed">
            Mergulhe nas palavras com letras que respiram no tempo exato da melodia. A transição contínua desliza suavemente até o verso ativo, com dissolução ótica nas extremidades e sincronia perfeita.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

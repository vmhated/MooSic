import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Waves, Sparkles } from 'lucide-react';
import { Track } from '@/types/domain/music';

interface DynamicAtmosphereSectionProps {
  tracks: Track[];
  activeTrack: Track;
  onSelectTrack: (track: Track) => void;
}

export const DynamicAtmosphereSection: React.FC<DynamicAtmosphereSectionProps> = ({
  tracks,
  activeTrack,
  onSelectTrack,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const accentColor = activeTrack.accent || '#8B5CF6';

  return (
    <section
      id="atmosphere"
      className="relative py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Dynamic Ambient Tone Wash */}
      <motion.div
        className="absolute top-1/2 right-10 -translate-y-1/2 w-[600px] h-[480px] rounded-full blur-[170px] pointer-events-none opacity-20 transition-colors duration-700 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 75%)`,
        }}
      />

      {/* Section Marker */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-bold text-brand-purple">02</span>
        <span className="h-[1px] w-6 bg-brand-purple" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Dynamic Atmosphere
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Headline & Statement */}
        <motion.div
          className="lg:col-span-6 space-y-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans text-white tracking-tight uppercase leading-[0.98]">
            Your music. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-primary to-brand-purple">
              Your atmosphere.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed">
            A interface respira com a paleta de cada faixa. Iluminação ambiente e contrastes são extraídos em tempo real para transformar a tela em uma extensão da arte do álbum.
          </p>

          {/* Interactive Mood Swatches */}
          <div className="pt-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Selecione uma faixa:
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              {tracks.slice(0, 4).map((t) => {
                const isSelected = t.id === activeTrack.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTrack(t)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-surface-elevated border-brand-purple text-white shadow-sm ring-1 ring-brand-purple/40'
                        : 'bg-surface/50 border-surface-border text-text-secondary hover:text-white hover:border-text-secondary/50'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: t.accent || '#8B5CF6' }}
                    />
                    <span className="font-sans font-semibold">{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Visual Stage with Large Artwork & Waveform */}
        <motion.div
          className="lg:col-span-6 relative p-8 sm:p-10 rounded-3xl bg-surface-elevated/80 border border-surface-border backdrop-blur-xl shadow-2xl overflow-hidden"
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9)`,
          }}
        >
          {/* Top Accent Strip */}
          <div
            className="absolute top-0 inset-x-0 h-1 transition-colors duration-700"
            style={{ backgroundColor: accentColor }}
          />

          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-surface-border shrink-0 shadow-lg">
              <img
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 min-w-0">
              <span className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                {activeTrack.genre || 'Lossless Sound'}
              </span>
              <h3 className="text-2xl font-bold text-white font-sans truncate">
                {activeTrack.title}
              </h3>
              <p className="text-sm text-text-secondary font-sans truncate">
                {activeTrack.artistName} • {activeTrack.albumTitle || 'Álbum'}
              </p>
            </div>
          </div>

          {/* Clean Resonance Spectrum Bars */}
          <div className="p-6 rounded-2xl bg-background/80 border border-surface-border space-y-4">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-2 font-medium">
                <Waves className="w-4 h-4 text-brand-purple" />
                <span>Ressonância Sonora</span>
              </span>
              <span className="font-semibold text-text-secondary">{activeTrack.title}</span>
            </div>

            <div className="flex items-end justify-between gap-1.5 h-16 pt-2">
              {[40, 75, 55, 95, 65, 85, 45, 100, 80, 60, 90, 70, 85, 50, 75, 40].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full transition-colors duration-700"
                  style={{
                    backgroundColor: accentColor,
                    opacity: 0.7 + (i % 3) * 0.1,
                  }}
                  animate={
                    shouldReduceMotion
                      ? { height: `${h * 0.6}%` }
                      : { height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }
                  }
                  transition={{
                    duration: 1.2 + (i % 4) * 0.2,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>Harmonia visual gerada pela arte</span>
            </span>
            <span>Hi-Res Lossless</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

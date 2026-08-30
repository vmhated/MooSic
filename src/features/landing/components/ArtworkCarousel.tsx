import React, { useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Disc3, Sparkles } from 'lucide-react';
import { Track } from '@/types/domain/music';

interface ArtworkCarouselProps {
  tracks: Track[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onTrackSelect?: (track: Track) => void;
}

export const ArtworkCarousel: React.FC<ArtworkCarouselProps> = ({
  tracks,
  activeIndex,
  onActiveChange,
  onTrackSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const activeTrack = tracks[activeIndex] || tracks[0];

  const handleNext = useCallback(() => {
    onActiveChange((activeIndex + 1) % tracks.length);
  }, [activeIndex, tracks.length, onActiveChange]);

  const handlePrev = useCallback(() => {
    onActiveChange((activeIndex - 1 + tracks.length) % tracks.length);
  }, [activeIndex, tracks.length, onActiveChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <section
      id="discover"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-24 focus:outline-none select-none overflow-hidden"
      aria-label="Descoberta de Músicas sem Limites"
    >
      {/* Background Subtle Color Wash */}
      <motion.div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[450px] rounded-full blur-[170px] pointer-events-none opacity-20 transition-colors duration-700 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${activeTrack.accent || '#8B5CF6'} 0%, transparent 70%)`,
        }}
      />

      {/* EDITORIAL SECTION HEADER EM PORTUGUÊS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-6 border-b border-white/10">
        <div className="space-y-3 max-w-2xl">
          {/* Section Marker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-brand-purple">01</span>
            <span className="h-[1px] w-6 bg-brand-purple" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-light bg-white/[0.05] px-3 py-1 rounded-full border border-white/10">
              Fluxo de Descoberta
            </span>
          </div>

          {/* Heading em Português Poético */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans text-white tracking-tight uppercase leading-[0.98]">
            Explore o som <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-light to-brand-purple drop-shadow-md">
              além do visível.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-text-secondary font-sans leading-relaxed">
            Navegue por uma galeria sonora viva. Do rap que move a cidade ao sintetizador mais profundo, cada disco tem sua própria assinatura.
          </p>
        </div>

        {/* Tactile Glassmorphic Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label="Faixa anterior"
            className="w-12 h-12 rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-brand-purple/60 text-white flex items-center justify-center backdrop-blur-xl transition-all duration-200 active:scale-95 shadow-md group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próxima faixa"
            className="w-12 h-12 rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 hover:border-brand-purple/60 text-white flex items-center justify-center backdrop-blur-xl transition-all duration-200 active:scale-95 shadow-md group"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ASYMMETRIC 3D ARTWORK STAGE */}
      <div className="relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center py-4">
        <div className="relative flex items-center justify-center w-full max-w-5xl h-full">
          {tracks.map((track, idx) => {
            let offset = idx - activeIndex;
            if (offset < -Math.floor(tracks.length / 2)) offset += tracks.length;
            if (offset > Math.floor(tracks.length / 2)) offset -= tracks.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            const xOffset = offset * (typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 220);
            const scale = isActive ? 1.06 : Math.max(0.74, 1 - Math.abs(offset) * 0.18);
            const rotateY = offset * -12;
            const zIndex = 20 - Math.abs(offset) * 5;
            const opacity = isActive ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.35);

            return (
              <motion.div
                key={track.id}
                onClick={() => {
                  onActiveChange(idx);
                  onTrackSelect?.(track);
                }}
                className="absolute cursor-pointer"
                style={{ zIndex }}
                initial={false}
                animate={{
                  x: xOffset,
                  scale,
                  rotateY: shouldReduceMotion ? 0 : rotateY,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 28,
                  mass: 0.2,
                }}
                whileHover={!isActive ? { scale: scale * 1.04, opacity: 0.85 } : { scale: 1.08 }}
              >
                {/* Artwork Frame com Glassmorphism */}
                <div
                  className={`relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 aspect-square rounded-3xl overflow-hidden bg-surface-elevated border transition-all duration-300 ${
                    isActive
                      ? 'border-brand-purple shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.4)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={track.coverUrl}
                    alt={`${track.title} - ${track.artistName}`}
                    className="w-full h-full object-cover object-center aspect-square select-none pointer-events-none"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  {isActive && track.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-xs font-bold text-white uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-brand-purple" />
                      <span>{track.badge}</span>
                    </div>
                  )}

                  {/* Track Meta at Bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
                    <span className="text-xs font-bold text-brand-light uppercase tracking-wider">
                      {track.genre || 'Música'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white font-sans truncate">
                      {track.title}
                    </h3>
                    <p className="text-xs text-text-secondary font-sans truncate font-medium">
                      {track.artistName}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Track Highlight Meta Bar Glassmorphic */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto p-4 rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <Disc3 className="w-5 h-5 text-brand-purple animate-spin-slow" />
          <span className="text-sm font-bold text-white">{activeTrack.title}</span>
          <span className="text-text-muted">•</span>
          <span className="text-sm text-text-secondary font-medium">{activeTrack.artistName}</span>
        </div>

        <div className="flex items-center gap-2">
          {tracks.map((_, i) => (
            <button
              key={i}
              onClick={() => onActiveChange(i)}
              aria-label={`Faixa ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-brand-purple shadow-glow'
                  : 'w-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

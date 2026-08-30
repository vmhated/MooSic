import React, { useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Disc3 } from 'lucide-react';
import { MockTrack } from '../data/mockMusicData';

interface ArtworkCarouselProps {
  tracks: MockTrack[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onTrackSelect?: (track: MockTrack) => void;
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
          background: `radial-gradient(circle at center, ${activeTrack.accent} 0%, transparent 70%)`,
        }}
      />

      {/* EDITORIAL SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-6 border-b border-surface-border/60">
        <div className="space-y-3 max-w-2xl">
          {/* Section Marker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-brand-purple">01</span>
            <span className="h-[1px] w-6 bg-brand-purple" />
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Discovery Flow
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans text-white tracking-tight uppercase leading-[0.98]">
            Explore the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-primary to-text-secondary">
              unseen sound.
            </span>
          </h2>
        </div>

        {/* Tactile Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label="Faixa anterior"
            className="w-12 h-12 rounded-2xl bg-surface-elevated border border-surface-border text-text-secondary hover:text-white hover:border-brand-purple/60 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próxima faixa"
            className="w-12 h-12 rounded-2xl bg-surface-elevated border border-surface-border text-text-secondary hover:text-white hover:border-brand-purple/60 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
          >
            <ArrowRight className="w-5 h-5" />
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
                {/* Artwork Frame */}
                <div
                  className={`relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden bg-surface-elevated border transition-all duration-300 ${
                    isActive
                      ? 'border-brand-purple shadow-2xl'
                      : 'border-surface-border hover:border-text-secondary/40'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? `0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(139, 92, 246, 0.4)`
                      : '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                >
                  <img
                    src={track.artwork}
                    alt={`${track.title} - ${track.artist}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />

                  {/* Top Badge */}
                  {isActive && track.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white uppercase tracking-wider">
                      {track.badge}
                    </div>
                  )}

                  {/* Track Meta at Bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
                    <span className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                      {track.genre}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white font-sans truncate">
                      {track.title}
                    </h3>
                    <p className="text-xs text-text-secondary font-sans truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Track Highlight Meta Bar */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-surface-elevated/80 border border-surface-border backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Disc3 className="w-5 h-5 text-brand-purple animate-spin-slow" />
          <span className="text-sm font-bold text-white">{activeTrack.title}</span>
          <span className="text-text-muted">•</span>
          <span className="text-sm text-text-secondary">{activeTrack.artist}</span>
        </div>

        <div className="flex items-center gap-2">
          {tracks.map((_, i) => (
            <button
              key={i}
              onClick={() => onActiveChange(i)}
              aria-label={`Faixa ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-brand-purple'
                  : 'w-2 bg-surface-border hover:bg-text-secondary'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

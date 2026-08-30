import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Disc } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const activeTrack = tracks[activeIndex] || tracks[0];

  const handleNext = useCallback(() => {
    onActiveChange((activeIndex + 1) % tracks.length);
  }, [activeIndex, tracks.length, onActiveChange]);

  const handlePrev = useCallback(() => {
    onActiveChange((activeIndex - 1 + tracks.length) % tracks.length);
  }, [activeIndex, tracks.length, onActiveChange]);

  // Keyboard navigation when container is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  };

  // Subtle auto-advance every 6s if not hovering or reduced motion
  useEffect(() => {
    if (isHovered || shouldReduceMotion) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, shouldReduceMotion, handleNext]);

  return (
    <div
      id="carousel-discovery"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/50 rounded-3xl select-none"
      aria-label="Carrossel de Descoberta Contínua MooSic"
    >
      {/* Background Subtle Accent Glow based on active track */}
      <motion.div
        className="absolute inset-0 max-w-4xl mx-auto rounded-full blur-[110px] pointer-events-none opacity-20 -z-10 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeTrack.accent} 0%, transparent 70%)`,
        }}
      />

      {/* Header of the Carousel section */}
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Descoberta Contínua
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
            O fluxo sonoro nunca para
          </h2>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Faixa anterior"
            className="w-10 h-10 rounded-full bg-surface-elevated border border-surface-border text-text-secondary hover:text-white hover:border-brand-purple/50 flex items-center justify-center transition-all active:scale-95 shadow-sm hover:shadow-glow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próxima faixa"
            className="w-10 h-10 rounded-full bg-surface-elevated border border-surface-border text-text-secondary hover:text-white hover:border-brand-purple/50 flex items-center justify-center transition-all active:scale-95 shadow-sm hover:shadow-glow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D Visual Artwork Stage */}
      <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center overflow-hidden py-6">
        <div className="relative flex items-center justify-center w-full max-w-4xl h-full">
          {tracks.map((track, idx) => {
            // Calculate relative offset from active index with looping
            let offset = idx - activeIndex;
            if (offset < -Math.floor(tracks.length / 2)) offset += tracks.length;
            if (offset > Math.floor(tracks.length / 2)) offset -= tracks.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Visual metrics per offset
            const xOffset = offset * (window.innerWidth < 640 ? 140 : 210);
            const scale = isActive ? 1.05 : Math.max(0.72, 1 - Math.abs(offset) * 0.18);
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
                className="absolute cursor-pointer transition-shadow"
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
                  damping: 26,
                  mass: 0.8,
                }}
                whileHover={!isActive ? { scale: scale * 1.06, opacity: 0.85 } : { scale: 1.08 }}
              >
                {/* Artwork Card Container */}
                <div
                  className={`relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden bg-surface-elevated border transition-all duration-300 shadow-2xl ${
                    isActive
                      ? 'border-brand-purple/60 shadow-[0_15px_40px_rgba(0,0,0,0.8)]'
                      : 'border-surface-border hover:border-text-secondary/40'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? `0 20px 50px -10px rgba(${track.accentRgb}, 0.35), 0 0 0 1px rgba(139, 92, 246, 0.4)`
                      : undefined,
                  }}
                >
                  {/* Album Cover Image */}
                  <img
                    src={track.artwork}
                    alt={`${track.title} - ${track.artist}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />

                  {/* Active Indicator Top Tag */}
                  {isActive && track.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-brand-light uppercase tracking-wider">
                      {track.badge}
                    </div>
                  )}

                  {/* Vinyl Texture Hint on side */}
                  {isActive && (
                    <div className="absolute top-3 right-3 text-white/50">
                      <Disc className="w-4 h-4 animate-spin-slow" />
                    </div>
                  )}

                  {/* Track Info Overlay at bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate font-sans drop-shadow-md">
                      {track.title}
                    </h3>
                    <p className="text-xs text-text-secondary truncate font-sans">
                      {track.artist}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Track Highlight Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 flex flex-col items-center justify-center text-center space-y-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg sm:text-xl font-bold text-white font-sans">
              {activeTrack.title}
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-base sm:text-lg text-text-secondary font-sans font-medium">
              {activeTrack.artist}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>Álbum: {activeTrack.album}</span>
            <span>•</span>
            <span>{activeTrack.genre}</span>
            <span>•</span>
            <span className="font-mono">{activeTrack.duration}</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 pt-4">
            {tracks.map((_, i) => (
              <button
                key={i}
                onClick={() => onActiveChange(i)}
                aria-label={`Ir para música ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 bg-brand-purple shadow-glow'
                    : 'w-1.5 bg-surface-border hover:bg-text-secondary'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

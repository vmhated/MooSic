import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Play, ArrowUpRight, Disc } from 'lucide-react';
import { Track } from '@/types/domain/music';

interface BrandRevealHeroProps {
  onStartClick?: () => void;
  activeTrack: Track;
}

export const BrandRevealHero: React.FC<BrandRevealHeroProps> = ({
  onStartClick,
  activeTrack,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const artworkSrc = activeTrack.coverUrl;
  const accentColor = activeTrack.accent || '#8B5CF6';

  return (
    <section
      className="relative min-h-[92vh] w-full bg-background flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-12 overflow-hidden select-none"
      aria-label="MooSic Hero Brand Experience"
    >
      {/* Background Subtle Color Wash */}
      <motion.div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[550px] rounded-full blur-[180px] pointer-events-none opacity-20 transition-colors duration-1000 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 75%)`,
        }}
      />

      {/* TOP BRAND ANCHOR HEADER */}
      <div className="w-full flex items-center justify-between text-xs text-text-muted z-20">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
          <span className="text-xs font-medium text-text-secondary">Live Soundstream</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-text-secondary font-medium">
          <span>Hi-Res Lossless 24-Bit</span>
          <span>•</span>
          <span>M ∞ Sic</span>
        </div>
      </div>

      {/* MAIN HERO GRID (Headline Left + Asymmetric Large Artwork Right) */}
      <div className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-auto py-6 z-20">
        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left Column: Integrated M(∞)Sic Brand Signature + Headline + Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Integrated M(∞)Sic Header Signature */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 font-brand font-extrabold text-2xl text-white">
                <span>M</span>
                <div className="w-7 h-3.5 relative inline-flex items-center justify-center mx-0.5">
                  <svg viewBox="0 0 200 100" fill="none" className="w-full h-full">
                    <path
                      d="M 100 50 C 122 20, 168 20, 168 50 C 168 80, 122 80, 100 50 C 78 20, 32 20, 32 50 C 32 80, 78 80, 100 50 Z"
                      stroke="#8B5CF6"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Sic</span>
              </div>
              <span className="text-text-muted">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Where music never ends
              </span>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-sans text-white tracking-tighter leading-[0.95] uppercase">
              Sound in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-primary to-brand-purple">
                infinite flow.
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed max-w-lg">
              Áudio de estúdio de 24 bits, atmosfera reativa e descoberta ininterrupta. Onde a música nunca para.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={onStartClick}
                className="text-base px-8 py-4 font-bold shadow-glow hover:shadow-glow-lg"
              >
                Start listening
              </Button>

              <a
                href="#discover"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-text-secondary hover:text-white px-6 py-4 rounded-xl border border-surface-border hover:border-text-secondary/50 bg-surface/40 hover:bg-surface-elevated transition-all"
              >
                <span>Explore catalogue</span>
                <ArrowUpRight className="w-4 h-4 text-brand-purple" />
              </a>
            </div>
          </div>

          {/* Right Column: Asymmetric Large Artwork */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm aspect-square rounded-3xl overflow-hidden border border-surface-border shadow-2xl bg-surface-elevated group">
              <img
                src={artworkSrc}
                alt={activeTrack.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

              {/* Top Playing Tag */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                <span>Now Playing</span>
              </div>

              {/* Vinyl Icon */}
              <div className="absolute top-4 right-4 text-white/70">
                <Disc className="w-5 h-5 animate-spin-slow" />
              </div>

              {/* Bottom Meta Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
                <span className="text-xs font-semibold text-brand-light uppercase tracking-wider">
                  {activeTrack.genre || 'Lossless Audio'} • {activeTrack.badge || 'MusicBrainz'}
                </span>
                <h3 className="text-xl font-bold text-white font-sans truncate">
                  {activeTrack.title}
                </h3>
                <p className="text-xs text-text-secondary font-sans truncate">
                  {activeTrack.artistName}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM METADATA BAR */}
      <div className="w-full pt-4 border-t border-surface-border/40 flex items-center justify-between text-xs text-text-muted z-20">
        <span>MooSic Platform</span>
        <span>Hi-Res Lossless 24-Bit Audio</span>
      </div>
    </section>
  );
};

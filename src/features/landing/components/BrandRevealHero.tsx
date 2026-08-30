import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Play, ArrowUpRight, Disc, Radio, Waves, Zap } from 'lucide-react';
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
      className="relative min-h-[96vh] w-full bg-background flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-12 overflow-hidden select-none"
      aria-label="MooSic Experiência Sonora"
    >
      {/* Background Volumetric Color Halos */}
      <motion.div
        className="absolute top-1/4 right-1/4 -translate-y-1/2 w-[700px] h-[600px] rounded-full blur-[190px] pointer-events-none opacity-25 transition-colors duration-1000 -z-10"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 75%)`,
        }}
      />
      <div
        className="absolute top-10 left-1/3 w-[450px] h-[350px] rounded-full blur-[160px] pointer-events-none opacity-15 -z-10"
        style={{
          background: `radial-gradient(circle at center, #8B5CF6 0%, transparent 75%)`,
        }}
      />

      {/* TOP STUDIO SOUND RIBBON EM PORTUGUÊS COM GLASSMORPHISM */}
      <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-2xl p-2 sm:px-5 sm:py-3 flex items-center justify-between gap-4 text-xs z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {/* Left: Live Soundstream Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px] uppercase tracking-wider">No Ar • Ao Vivo</span>
          </div>
          <span className="hidden md:inline text-text-muted text-[11px] font-mono font-medium">
            Lossless 24-Bit / 96kHz
          </span>
        </div>

        {/* Center: Cyber-Editorial Sound Ribbon Ticker */}
        <div className="hidden lg:flex items-center gap-3 overflow-hidden text-text-secondary text-[11px] font-semibold tracking-wider uppercase">
          <div className="flex items-center gap-2 text-brand-purple">
            <Zap className="w-3 h-3" />
            <span className="text-white font-bold">M(∞)Sic Motor Sonoro</span>
          </div>
          <span className="text-text-muted">•</span>
          <span>100M+ Músicas em Qualidade Master</span>
          <span className="text-text-muted">•</span>
          <span>Áudio Espacial 360°</span>
        </div>

        {/* Right: Active Live Stream Pill */}
        <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 px-3 py-1 rounded-xl">
          <Waves className="w-3.5 h-3.5 text-brand-purple animate-pulse shrink-0" />
          <span className="text-white font-bold truncate max-w-[140px] sm:max-w-[200px]">
            {activeTrack.title}
          </span>
          <span className="hidden sm:inline text-text-muted text-[10px] uppercase font-black text-brand-light">
            FLAC Master
          </span>
        </div>
      </div>

      {/* MAIN HERO GRID (Headline Left + Fluid Responsive Artwork Right) */}
      <div className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-auto py-8 z-20">
        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left Column: Brand Signature + Monumental Headline + Action CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Integrated M(∞)Sic Header Signature */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 font-brand font-black text-3xl sm:text-4xl text-white">
                <span>M</span>
                <div className="w-9 h-4.5 relative inline-flex items-center justify-center mx-0.5">
                  <svg viewBox="0 0 200 100" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(192,132,252,0.9)]">
                    <path
                      d="M 100 50 C 122 18, 172 18, 172 50 C 172 82, 122 82, 100 50 C 78 18, 28 18, 28 50 C 28 82, 78 82, 100 50 Z"
                      stroke="#A855F7"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Sic</span>
              </div>
              <span className="text-text-muted">•</span>
              <span className="text-xs font-black uppercase tracking-wider text-brand-light bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                Onde a música nunca tem fim
              </span>
            </div>

            {/* Monumental Poetic Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-sans text-white tracking-tighter leading-[0.95] uppercase">
              O som no <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-light to-brand-purple drop-shadow-md">
                fluxo do infinito.
              </span>
            </h1>

            {/* Value Proposition em Português */}
            <p className="text-base sm:text-lg text-text-secondary font-sans leading-relaxed max-w-lg">
              Áudio de estúdio de 24 bits, rimas autênticas da quebrada ao mundo e atmosfera cromática em tempo real. A música que não tem barreiras.
            </p>

            {/* Action Buttons com Glassmorphism Real */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={onStartClick}
                className="text-base px-8 py-4 font-black shadow-glow hover:shadow-glow-lg"
              >
                Ouvir agora
              </Button>

              <Button
                variant="glass"
                size="lg"
                rightIcon={<ArrowUpRight className="w-4 h-4 text-brand-light" />}
                onClick={() => {
                  const el = document.getElementById('discover');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-base px-7 py-4 font-bold"
              >
                Explorar catálogo
              </Button>
            </div>
          </div>

          {/* Right Column: Fluid Responsive 1:1 Square Artwork Card */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(139,92,246,0.25)] bg-surface-elevated group mx-auto">
              <img
                src={artworkSrc}
                alt={activeTrack.title}
                className="w-full h-full object-cover object-center aspect-square transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85';
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-black/30 pointer-events-none" />

              {/* Top Playing Tag */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                <span>Tocando Agora</span>
              </div>

              {/* Vinyl Icon */}
              <div className="absolute top-4 right-4 text-white/80">
                <Disc className="w-5 h-5 animate-spin-slow" />
              </div>

              {/* Bottom Meta Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
                <span className="text-xs font-black text-brand-light uppercase tracking-wider">
                  {activeTrack.genre || 'Áudio Lossless'} • {activeTrack.badge || 'Oficial HD'}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-sans truncate">
                  {activeTrack.title}
                </h3>
                <p className="text-xs text-text-secondary font-sans truncate font-medium">
                  {activeTrack.artistName} • <span className="text-text-muted">{activeTrack.albumTitle}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM METADATA BAR */}
      <div className="w-full max-w-6xl mx-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-text-muted z-20">
        <span>Plataforma MooSic • Master de Estúdio</span>
        <span>Áudio Hi-Res Lossless 24-Bit</span>
      </div>
    </section>
  );
};

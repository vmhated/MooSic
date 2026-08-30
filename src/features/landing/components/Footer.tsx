import React from 'react';
import { MooLogo } from '@/components/common/MooLogo';
import { LivingInfinity } from './LivingInfinity';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-surface-border bg-background pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Subtle Glow at footer center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-brand-purple/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand Info */}
          <div className="space-y-3">
            <MooLogo size="lg" />
            <p className="text-sm text-text-secondary max-w-sm font-sans">
              Onde o som nunca para e cada nota conecta você à sua próxima descoberta.
            </p>
          </div>

          {/* Living Infinity Center Motif */}
          <div className="flex flex-col items-center gap-2">
            <LivingInfinity size={70} glowOpacity={0.25} />
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Infinite Flow Concept
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm font-medium text-text-secondary">
            <a href="#carousel-discovery" className="hover:text-white transition-colors">
              Artworks
            </a>
            <a href="#storytelling" className="hover:text-white transition-colors">
              Histórias & Letras
            </a>
            <a href="#player-preview" className="hover:text-white transition-colors">
              Player
            </a>
          </div>
        </div>

        {/* Bottom Legal & Tech */}
        <div className="pt-8 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-sans">
          <span>© 2026 MooSic Platform Inc. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <span>Manrope + Plus Jakarta Sans</span>
            <span>•</span>
            <span>Lossless Audio Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

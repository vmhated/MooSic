import React from 'react';
import { MooLogo } from '@/components/common/MooLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-surface-border bg-background pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Brand Info */}
          <div className="space-y-3">
            <MooLogo size="lg" />
            <p className="text-sm text-text-secondary max-w-sm font-sans">
              Onde o som nunca para e cada nota conecta você à sua próxima descoberta.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#discover" className="hover:text-white transition-colors">
              Discover
            </a>
            <a href="#atmosphere" className="hover:text-white transition-colors">
              Atmosphere
            </a>
            <a href="#lyrics" className="hover:text-white transition-colors">
              Lyrics
            </a>
            <a href="#player" className="hover:text-white transition-colors">
              Player
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-sans">
          <span>© 2026 MooSic. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <span>Manrope + Plus Jakarta Sans</span>
            <span>•</span>
            <span>Hi-Res Lossless Audio Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { MooLogo } from '@/components/common/MooLogo';
import { Button } from '@/components/ui/Button';
import { Menu, X, Play, Sparkles } from 'lucide-react';

interface NavbarProps {
  onStartClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none select-none">
      {/* Floating Island Capsule Container com Glassmorphism */}
      <div className="max-w-5xl mx-auto rounded-full bg-surface-elevated/80 backdrop-blur-2xl border border-white/15 hover:border-brand-purple/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.2)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto transition-all duration-300">
        {/* Brand Wordmark Logo com Brilho Néon */}
        <a
          href="#"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-full p-1"
          aria-label="MooSic Início"
        >
          <MooLogo size="md" />
        </a>

        {/* Desktop Product Navigation em Português */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10 text-xs font-bold text-text-secondary">
          <a
            href="#discover"
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200"
          >
            Descobrir
          </a>
          <a
            href="#atmosphere"
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200"
          >
            Atmosfera
          </a>
          <a
            href="#lyrics"
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200"
          >
            Letras
          </a>
          <a
            href="#player"
            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 hover:shadow-sm transition-all duration-200"
          >
            Player
          </a>
        </nav>

        {/* Action Button Glassmorphic */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={onStartClick}
            className="text-xs px-5 py-2.5 rounded-full font-extrabold tracking-wide"
          >
            Ouvir agora
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar navegação"
            className="p-2 rounded-full bg-white/10 border border-white/15 text-text-secondary hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-md mx-auto mt-2 rounded-3xl bg-surface-elevated/95 backdrop-blur-3xl border border-white/15 p-6 space-y-4 shadow-2xl pointer-events-auto">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-text-secondary">
            <a
              href="#discover"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1 flex items-center justify-between"
            >
              <span>Descobrir</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
            </a>
            <a
              href="#atmosphere"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Atmosfera
            </a>
            <a
              href="#lyrics"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Letras
            </a>
            <a
              href="#player"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Player
            </a>
          </nav>
          <div className="pt-3 border-t border-surface-border flex flex-col gap-2">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => {
                setMobileMenuOpen(false);
                onStartClick?.();
              }}
              className="rounded-full"
            >
              Ouvir agora
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

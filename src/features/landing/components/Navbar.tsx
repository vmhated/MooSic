import React, { useState, useEffect } from 'react';
import { MooLogo } from '@/components/common/MooLogo';
import { Button } from '@/components/ui/Button';
import { Menu, X, Play } from 'lucide-react';

interface NavbarProps {
  onStartClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-surface-border/80 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg">
          <MooLogo size="md" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a
            href="#carousel-discovery"
            className="hover:text-white transition-colors"
          >
            Descoberta
          </a>
          <a
            href="#storytelling"
            className="hover:text-white transition-colors"
          >
            Conceito & Letras
          </a>
          <a
            href="#player-preview"
            className="hover:text-white transition-colors"
          >
            Player
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={onStartClick}
            className="shadow-glow text-xs px-4 py-2"
          >
            Start listening
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
            className="p-2 rounded-xl bg-surface-elevated border border-surface-border text-text-secondary hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-elevated/95 backdrop-blur-2xl border-b border-surface-border px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-4 text-base font-medium text-text-secondary">
            <a
              href="#carousel-discovery"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Descoberta Contínua
            </a>
            <a
              href="#storytelling"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Conceito & Letras
            </a>
            <a
              href="#player-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Player Preview
            </a>
          </nav>
          <div className="pt-4 border-t border-surface-border">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => {
                setMobileMenuOpen(false);
                onStartClick?.();
              }}
            >
              Start listening
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

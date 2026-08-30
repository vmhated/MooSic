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
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-surface-border/80 py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Wordmark Logo */}
        <a
          href="#"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg"
          aria-label="MooSic Início"
        >
          <MooLogo size="md" />
        </a>

        {/* Desktop Product Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a
            href="#discover"
            className="hover:text-white transition-colors duration-200"
          >
            Discover
          </a>
          <a
            href="#atmosphere"
            className="hover:text-white transition-colors duration-200"
          >
            Atmosphere
          </a>
          <a
            href="#lyrics"
            className="hover:text-white transition-colors duration-200"
          >
            Lyrics
          </a>
          <a
            href="#player"
            className="hover:text-white transition-colors duration-200"
          >
            Player
          </a>
        </nav>

        {/* Product Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={onStartClick}
            className="text-xs font-semibold text-text-secondary hover:text-white transition-colors px-3 py-2"
          >
            Log in
          </button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={onStartClick}
            className="text-xs px-4 py-2 shadow-glow"
          >
            Start listening
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Alternar navegação"
            className="p-2 rounded-xl bg-surface-elevated border border-surface-border text-text-secondary hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-elevated/98 backdrop-blur-2xl border-b border-surface-border px-6 py-6 space-y-4 shadow-2xl">
          <nav className="flex flex-col gap-4 text-base font-medium text-text-secondary">
            <a
              href="#discover"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Discover
            </a>
            <a
              href="#atmosphere"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Atmosphere
            </a>
            <a
              href="#lyrics"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Lyrics
            </a>
            <a
              href="#player"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors py-1"
            >
              Player
            </a>
          </nav>
          <div className="pt-4 border-t border-surface-border flex flex-col gap-3">
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
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartClick?.();
              }}
              className="text-xs font-semibold text-center text-text-secondary hover:text-white py-2"
            >
              Log in com sua conta
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

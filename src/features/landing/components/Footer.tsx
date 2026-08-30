import { MooLogo } from '@/components/common/MooLogo';

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-white/10 py-16 px-4 sm:px-8 lg:px-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-xs text-text-muted">
        {/* Brand & Manifesto */}
        <div className="space-y-3 text-center md:text-left">
          <MooLogo size="sm" />
          <p className="max-w-xs text-text-secondary">
            Onde a música nunca tem fim. Áudio de estúdio de 24 bits, rimas autênticas e conexão sonora contínua.
          </p>
        </div>

        {/* Links Rápidos em Português */}
        <div className="flex items-center gap-8 text-text-secondary font-semibold">
          <a href="#discover" className="hover:text-white transition-colors">
            Descobrir
          </a>
          <a href="#atmosphere" className="hover:text-white transition-colors">
            Atmosfera
          </a>
          <a href="#lyrics" className="hover:text-white transition-colors">
            Letras
          </a>
          <a href="#player" className="hover:text-white transition-colors">
            Player
          </a>
        </div>

        {/* Direitos e Qualidade */}
        <div className="text-center md:text-right space-y-1 font-medium">
          <p>© {new Date().getFullYear()} MooSic Platform. Todos os direitos reservados.</p>
          <p className="text-text-muted">Hi-Res Lossless Audio • 24-Bit / 96kHz</p>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { useOnboarding } from '../../stores/OnboardingContext';
import { DiscoveryStyle } from '@/types/domain/taste';
import { ArrowRight, Loader2 } from 'lucide-react';

const DISCOVERY_STYLE_LABELS: Record<DiscoveryStyle, string> = {
  familiar: 'Familiar',
  balanced: 'Equilibrado',
  explorer: 'Explorador',
  niche_hunter: 'Caçador de Nichos',
};

const DISCOVERY_STYLE_DESCRIPTIONS: Record<DiscoveryStyle, string> = {
  familiar: 'Você prefere o conforto do que já conhece.',
  balanced: 'Você gosta de novidades, mas sem sair da sua zona.',
  explorer: 'Você está sempre em busca de sons novos.',
  niche_hunter: 'Você encontra as joias antes de todo mundo.',
};

export const ProfileReveal: React.FC = () => {
  const { draft, finishOnboarding } = useOnboarding();
  const [isSaving, setIsSaving] = useState(false);

  const artists = draft.favorite_artists || [];
  const genres = draft.favorite_genres || [];
  const discoveryStyle = draft.discovery_style;

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await finishOnboarding();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-3xl mx-auto p-6 sm:p-12 animate-fade-in pt-20 pb-32 text-center">
      {/* Header */}
      <div className="space-y-4 mb-14">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-light">
          Seu Som
        </p>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          O MooSic já tem uma ideia
          <br />
          <span className="text-brand-light">do seu universo musical.</span>
        </h2>
        <p className="text-text-muted font-medium max-w-xl mx-auto">
          Isso é só o começo. Quanto mais você usar o MooSic, mais precisa fica a sua identidade sonora.
        </p>
      </div>

      {/* Artists Collage */}
      {artists.length > 0 && (
        <div className="mb-12 w-full">
          <p className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-5 text-left">
            Seus Artistas ({artists.length})
          </p>
          <div className="flex flex-wrap gap-4 justify-start">
            {artists.map((artist) => (
              <div key={artist.provider_id} className="flex flex-col items-center gap-2 w-20">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex-shrink-0">
                  {artist.cover_url ? (
                    <img src={artist.cover_url} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-bold">
                      {artist.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-text-muted text-center truncate w-full">
                  {artist.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genres */}
      {genres.length > 0 && (
        <div className="mb-12 w-full">
          <p className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-5 text-left">
            Seus Gêneros ({genres.length})
          </p>
          <div className="flex flex-wrap gap-2 justify-start">
            {genres.map((genre) => (
              <span
                key={genre.provider_id}
                className="px-4 py-1.5 rounded-full text-sm font-bold bg-white/[0.06] border border-white/10 text-white/80"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Discovery Style */}
      {discoveryStyle && (
        <div className="mb-14 w-full p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] text-left">
          <p className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-3">
            Perfil de Descoberta
          </p>
          <p className="text-xl font-black text-white">{DISCOVERY_STYLE_LABELS[discoveryStyle]}</p>
          <p className="text-sm text-text-muted font-medium mt-1">{DISCOVERY_STYLE_DESCRIPTIONS[discoveryStyle]}</p>
        </div>
      )}

      {/* No Data State */}
      {artists.length === 0 && genres.length === 0 && !discoveryStyle && (
        <div className="mb-14 text-text-muted font-medium">
          Você pulou as etapas. Tudo bem — o MooSic vai aprender enquanto você ouve.
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleFinish}
        disabled={isSaving}
        className="flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-white text-black font-black text-base uppercase tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Salvando...</span>
          </>
        ) : (
          <>
            <span>Entrar no MooSic</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

import React from 'react';
import { ListeningSession } from '@/types/domain/session';
import { Play, Sparkles, Clock, CheckCircle2, Activity } from 'lucide-react';
import { usePlayer } from '@/stores/playerContext';
import { Track } from '@/types/domain/music';

interface LastSessionRecapProps {
  session: ListeningSession | null;
}

export const LastSessionRecap: React.FC<LastSessionRecapProps> = ({ session }) => {
  const { setQueue } = usePlayer();

  const story = session?.story;
  if (!session || !story || session.tracks.length === 0) {
    return null;
  }

  const durationMin = Math.max(1, Math.round(session.totalDurationSeconds / 60));

  const handlePlaySession = () => {
    const tracksToPlay: Track[] = session.tracks.map((t) => ({
      id: t.trackId,
      title: t.title,
      artistId: 'artist-session',
      artistName: t.artist,
      coverUrl: t.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
      durationSeconds: t.durationSeconds || 30,
      genre: story.dominantVibe || 'Sessão MooSic',
      isExplicit: false,
      providerId: 'moosic',
      providerTrackId: t.trackId,
    }));

    if (tracksToPlay.length > 0) {
      setQueue(tracksToPlay, 0, {
        type: 'flow',
        title: story.title,
      });
    }
  };

  return (
    <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-surface-elevated via-surface to-[#0A0B10] border border-white/10 shadow-xl overflow-hidden group">
      {/* Glow e iluminação de fundo suave */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-purple/20 transition-all duration-700" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Lado Esquerdo: Identidade e Narrativa */}
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-light bg-brand-purple/20 px-2.5 py-0.5 rounded-full border border-brand-purple/30 shadow-sm">
              <Sparkles className="w-3 h-3 text-brand-light" />
              <span>Sua Última Sessão</span>
            </span>

            <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-text-muted" />
              <span>{durationMin} min de imersão</span>
            </span>

            <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
              <Activity className="w-3 h-3 text-brand-light" />
              <span>{session.trackCount} {session.trackCount === 1 ? 'faixa' : 'faixas'}</span>
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{story.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 font-medium leading-relaxed">
              {story.narrative}
            </p>
          </div>

          {/* Insight comportamental */}
          <div className="flex items-center gap-2 text-[11px] text-brand-light/90 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{story.insight}</span>
          </div>
        </div>

        {/* Lado Direito: Ações e Linha do Tempo Resumida */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 flex-shrink-0">
          <button
            onClick={handlePlaySession}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-purple hover:bg-brand-hover text-white text-xs font-bold shadow-lg hover:shadow-brand-purple/25 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            <span>Reouvir Esta Sessão</span>
          </button>

          {/* Mini resumo de fases sonoras */}
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-mono">
            {story.phases.map((p, idx) => (
              <React.Fragment key={idx}>
                <span className="text-white/80 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  {p.label}
                </span>
                {idx < story.phases.length - 1 && <span className="text-white/30">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

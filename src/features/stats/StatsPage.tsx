import React from 'react';
import { useListeningSession } from '@/hooks/useListeningSession';
import { usePlayer } from '@/stores/playerContext';
import { Activity, Clock, Sparkles } from 'lucide-react';
import { Track } from '@/types/domain/music';
import { TrackRow } from '@/components/music/TrackRow';

export const StatsPage: React.FC = () => {
  const { recentSessions, history } = useListeningSession();
  const { setQueue, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();

  const totalListeningMinutes = recentSessions.reduce(
    (acc, s) => acc + Math.round(s.totalDurationSeconds / 60),
    0
  );

  const totalTracksPlayed = history.length;

  const handlePlayHistoryTrack = (_track: Track, idx: number) => {
    const pool = history.map((h) => h.track);
    setQueue(pool, idx, {
      type: 'flow',
      title: 'Histórico de Escuta',
      position: idx,
    });
  };

  return (
    <div className="space-y-8 select-none w-full max-w-[1720px] mx-auto pb-32">
      {/* 1. Topo Editorial: Cartografia Sonora */}
      <div className="relative rounded-4xl p-6 sm:p-10 bg-gradient-to-r from-surface-elevated via-surface to-[#0A0B10] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-light bg-brand-purple/20 px-3 py-1 rounded-full border border-brand-purple/30">
              <Activity className="w-3.5 h-3.5 text-brand-light" />
              <span>Cartografia Sonora & DNA</span>
            </span>
            <span className="text-xs text-text-muted font-mono">
              Arquitetura de Hábitos Musicais
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Sua Relação com a Música
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl font-medium">
            O MooSic observa sua jornada sonora. Cada sessão concluída, transição de ritmo e afinidade acústica compõe sua identidade musical viva.
          </p>

          {/* Cards de Métricas Rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] font-mono text-text-muted uppercase">Tempo de Imersão</p>
              <p className="text-lg sm:text-xl font-black text-white mt-0.5">{totalListeningMinutes} min</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] font-mono text-text-muted uppercase">Faixas Ouvidas</p>
              <p className="text-lg sm:text-xl font-black text-white mt-0.5">{totalTracksPlayed}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] font-mono text-text-muted uppercase">Sessões Gravadas</p>
              <p className="text-lg sm:text-xl font-black text-white mt-0.5">{recentSessions.length}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] font-mono text-text-muted uppercase">Arquétipo Sonoro</p>
              <p className="text-xs sm:text-sm font-black text-brand-light mt-1 truncate">Explorador Noturno</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Histórias das Últimas Sessões */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center text-brand-light">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Sessões Sonoras Recentes
            </h2>
            <p className="text-xs text-text-muted">Narrativas temporais construídas a partir de suas escutas</p>
          </div>
        </div>

        {recentSessions.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#0D0E14] border border-white/[0.06] text-center space-y-2">
            <p className="text-sm font-bold text-white">Nenhuma sessão registrada ainda</p>
            <p className="text-xs text-text-muted">Ouça músicas no Web Player para que o MooSic diagnostique seu fluxo sonoro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentSessions.map((session) => {
              const story = session.story;
              if (!story) return null;
              const durationMin = Math.max(1, Math.round(session.totalDurationSeconds / 60));

              return (
                <div
                  key={session.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#0D0E14] border border-white/[0.08] space-y-3 hover:border-white/15 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                    <span className="text-brand-light font-bold uppercase">{story.dominantVibe || 'Sessão MooSic'}</span>
                    <span>{durationMin} min • {session.trackCount} faixas</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {story.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {story.narrative}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 text-[10px] text-text-muted font-mono">
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
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Linha do Tempo de Reprodução */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center text-brand-light">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Linha do Tempo de Escuta
            </h2>
            <p className="text-xs text-text-muted">Registro temporal detalhado de cada faixa tocada</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#0D0E14] border border-white/[0.06] text-center space-y-2">
            <p className="text-sm font-bold text-white">Seu histórico está silencioso</p>
            <p className="text-xs text-text-muted">Dê play em qualquer música para preencher a sua linha do tempo.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {history.slice(0, 15).map((item, idx) => (
              <TrackRow
                key={`${item.track.id}-${idx}`}
                track={item.track}
                index={idx}
                isCurrent={currentTrack?.id === item.track.id}
                isPlaying={isPlaying && currentTrack?.id === item.track.id}
                isLiked={isLiked(item.track.id)}
                onPlay={() => handlePlayHistoryTrack(item.track, idx)}
                onToggleLike={() => toggleLike(item.track.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

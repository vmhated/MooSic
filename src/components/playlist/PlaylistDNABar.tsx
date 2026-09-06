import React from 'react';
import { PlaylistDNA } from '@/types/domain/playlist';
import { Dna, Zap, Wind, Music4, Mic2, Users, Gauge, Info } from 'lucide-react';

interface PlaylistDNABarProps {
  dna: PlaylistDNA;
}

interface MetricBarProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, icon: Icon, gradient }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-white/90">
          <Icon className="w-3.5 h-3.5 text-brand-light" />
          <span>{label}</span>
        </span>
        <span className="font-mono text-[11px] text-white/70">{value}%</span>
      </div>

      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${gradient}`}
          style={{ width: `${Math.max(4, value)}%` }}
        />
      </div>
    </div>
  );
};

export const PlaylistDNABar: React.FC<PlaylistDNABarProps> = ({ dna }) => {
  if (!dna.isAnalyzed || dna.totalTracks === 0) {
    return (
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-text-muted">
        <Info className="w-5 h-5 text-brand-purple flex-shrink-0" />
        <p className="text-xs">
          O <strong>Playlist DNA</strong> será gerado automaticamente quando você adicionar a primeira música a esta coleção.
        </p>
      </div>
    );
  }

  return (
    <div className="relative p-6 rounded-3xl bg-surface-elevated/75 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 overflow-hidden">
      {/* Luz ambiente no topo */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-brand-purple/10 blur-3xl pointer-events-none" />

      {/* Header do DNA da Playlist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-light bg-brand-purple/20 px-2.5 py-0.5 rounded-full border border-brand-purple/30">
              <Dna className="w-3 h-3 text-brand-light" />
              <span>Playlist DNA</span>
            </span>
            <span className="text-[11px] font-mono text-text-muted">
              {dna.totalTracks} {dna.totalTracks === 1 ? 'faixa analisada' : 'faixas analisadas'}
            </span>
          </div>

          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>{dna.archetypeTitle}</span>
          </h3>

          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            {dna.archetypeDescription}
          </p>
        </div>

        {/* Pílulas de Síntese Rápida */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/80 font-mono">
            <Gauge className="w-3.5 h-3.5 text-brand-purple" />
            <span>{dna.tempoAvg} BPM</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/80 font-mono">
            <Users className="w-3.5 h-3.5 text-brand-purple" />
            <span>{dna.uniqueArtistCount} {dna.uniqueArtistCount === 1 ? 'artista' : 'artistas'}</span>
          </div>
        </div>
      </div>

      {/* Grid de 4 Medidores Analíticos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricBar
          label="Energia Sonora"
          value={dna.energy}
          icon={Zap}
          gradient="from-amber-500 via-orange-500 to-rose-500"
        />

        <MetricBar
          label="Atmosfera & Espaço"
          value={dna.atmosphere}
          icon={Wind}
          gradient="from-indigo-500 via-purple-500 to-pink-500"
        />

        <MetricBar
          label="Dançabilidade"
          value={dna.danceability}
          icon={Music4}
          gradient="from-emerald-400 via-teal-500 to-cyan-500"
        />

        <MetricBar
          label="Presença Vocal"
          value={dna.vocalsRatio}
          icon={Mic2}
          gradient="from-violet-400 via-fuchsia-500 to-pink-500"
        />
      </div>
    </div>
  );
};

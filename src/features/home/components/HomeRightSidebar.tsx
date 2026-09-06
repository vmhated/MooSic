import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/stores/playerContext';
import { useRouter } from '@/app/routes/router';
import { Track } from '@/types/domain/music';
import { Artwork } from '@/components/ui/Artwork';
import { PlayButton } from '@/components/ui/PlayButton';
import {
  Radio,
  Sparkles,
  Flame,
  ListMusic,
  BarChart3,
  Users,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface TrendingArtist {
  id: string;
  name: string;
  genre: string;
  listeners: string;
  avatarUrl: string;
  trend: string;
  highlightTrackQuery: string;
}

const TRENDING_ARTISTS: TrendingArtist[] = [
  {
    id: 'matue',
    name: 'Matuê',
    genre: 'Trap Brasil / 30PRAUM',
    listeners: '8.4M mensais',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/c42fcb920963cca4d195b939e51f19d1/1000x1000-000000-80-0-0.jpg',
    trend: '+14%',
    highlightTrackQuery: 'Matue Maquina do Tempo',
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    genre: 'R&B / Synthpop',
    listeners: '112.5M mensais',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/581693b4724a7fcfa754455101e13a44/1000x1000-000000-80-0-0.jpg',
    trend: '+8%',
    highlightTrackQuery: 'The Weeknd Blinding Lights',
  },
  {
    id: 'bk',
    name: "BK'",
    genre: 'Rap & Lírica Urbana',
    listeners: '3.6M mensais',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/7481fc25e9bf8f0d8c416ecb9104927d/1000x1000-000000-80-0-0.jpg',
    trend: '+22%',
    highlightTrackQuery: 'BK Planos Castelos',
  },
  {
    id: 'dua-lipa',
    name: 'Dua Lipa',
    genre: 'Disco Pop / Dance',
    listeners: '68.3M mensais',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/877872aaf75694f11d53c318700ab2b5/1000x1000-000000-80-0-0.jpg',
    trend: '+5%',
    highlightTrackQuery: 'Dua Lipa Levitating',
  },
  {
    id: 'lofi-girl',
    name: 'Lofi Girl',
    genre: 'Chillhop & Foco',
    listeners: '14.2M mensais',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/f5c07c0a901f819f11d8a69b8e8da119/1000x1000-000000-80-0-0.jpg',
    trend: '+18%',
    highlightTrackQuery: 'Lofi study beats synthwave',
  },
];

interface HomeRightSidebarProps {
  fallbackTracks?: Track[];
}

export const HomeRightSidebar: React.FC<HomeRightSidebarProps> = ({ fallbackTracks = [] }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    toggleLike,
    isLiked,
    manualQueue,
    flowQueue,
    play,
  } = usePlayer();
  const { navigate } = useRouter();

  // Mini visualizador de ondas dinâmico
  const [waveBars, setWaveBars] = useState<number[]>([35, 60, 85, 45, 70, 95, 55, 40]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveBars([
        Math.floor(25 + Math.random() * 65),
        Math.floor(35 + Math.random() * 65),
        Math.floor(45 + Math.random() * 55),
        Math.floor(30 + Math.random() * 70),
        Math.floor(40 + Math.random() * 60),
        Math.floor(50 + Math.random() * 50),
        Math.floor(30 + Math.random() * 65),
        Math.floor(20 + Math.random() * 70),
      ]);
    }, 160);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Combina as próximas faixas da fila manual e do flow
  const upNextList: { track: Track; badgeLabel?: string; badgeColor?: string }[] = [];

  manualQueue.slice(0, 2).forEach((track) => {
    upNextList.push({
      track,
      badgeLabel: 'Manual',
      badgeColor: 'text-brand-light bg-brand-purple/20 border-brand-purple/30',
    });
  });

  const remainingSlots = 4 - upNextList.length;
  flowQueue.slice(0, remainingSlots).forEach((track) => {
    let label = 'Flow';
    let color = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (track.flowReason === 'same_artist') {
      label = 'Artista';
      color = 'text-brand-light bg-brand-purple/10 border-brand-purple/20';
    } else if (track.flowReason === 'same_genre') {
      label = 'Gênero';
      color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    } else if (track.flowReason === 'discovery') {
      label = 'Descoberta';
      color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
    upNextList.push({ track, badgeLabel: label, badgeColor: color });
  });

  if (upNextList.length === 0 && fallbackTracks.length > 0) {
    fallbackTracks.slice(0, 3).forEach((track) => {
      upNextList.push({
        track,
        badgeLabel: 'Sugerida',
        badgeColor: 'text-text-muted bg-white/[0.04] border-white/10',
      });
    });
  }

  const activeDisplayTrack = currentTrack || fallbackTracks[0];

  return (
    <aside className="w-full space-y-6 select-none">
      {/* ================= 1. HEADER DO RADAR MOOSIC ================= */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
          <span className="text-[11px] font-black uppercase tracking-wider text-text-primary">
            Radar & Sintonia Viva
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-brand-light bg-brand-purple/15 px-2 py-0.5 rounded-full border border-brand-purple/30">
          432 Hz Ativo
        </span>
      </div>

      {/* ================= 2. CARD: FREQUÊNCIA ATIVA & TOCANDO AGORA ================= */}
      {activeDisplayTrack && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#141520] to-[#0D0E14] border border-white/[0.08] p-4 sm:p-5 shadow-surface group">
          {/* Luz dinâmica sutil baseada na cor de destaque */}
          <div
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: activeDisplayTrack.accent || '#8B5CF6' }}
          />

          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-[10px] font-mono text-text-muted">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-light">
              <Radio className="w-3 h-3 text-brand-purple" />
              {currentTrack ? 'Tocando Agora' : 'Sintonia Sugerida'}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-text-secondary border border-white/[0.06] text-[9px] font-mono">
              FLAC • 24-bit
            </span>
          </div>

          <div className="mt-4 flex gap-4 items-center">
            {/* Capa com disco de vinil animado no hover/play */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden shadow-card border border-white/10 group-hover:scale-105 transition-transform duration-300">
              <Artwork
                src={activeDisplayTrack.coverUrl}
                alt={activeDisplayTrack.title}
                className="w-full h-full object-cover"
              />
              {isPlaying && currentTrack?.id === activeDisplayTrack.id && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-5 px-1">
                    {waveBars.slice(0, 4).map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-brand-light rounded-full transition-all duration-150"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Metadados da Faixa */}
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-sm font-black text-white truncate group-hover:text-brand-light transition-colors">
                {activeDisplayTrack.title}
              </h3>
              <p
                onClick={() =>
                  navigate(`/app/artist/${encodeURIComponent(activeDisplayTrack.artistName)}`)
                }
                className="text-xs text-text-secondary hover:text-white transition-colors truncate cursor-pointer"
              >
                {activeDisplayTrack.artistName}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-text-muted font-mono">
                  {activeDisplayTrack.durationFormatted || '3:30'}
                </span>
                <span className="text-[10px] text-brand-light/80 font-mono">• 432 Hz</span>
              </div>
            </div>

            {/* Botões de Ação Rápida */}
            <div className="flex flex-col gap-2 items-center">
              <PlayButton
                isPlaying={isPlaying && currentTrack?.id === activeDisplayTrack.id}
                onClick={() => {
                  if (currentTrack?.id === activeDisplayTrack.id) {
                    togglePlay();
                  } else {
                    play(activeDisplayTrack, {
                      type: 'home',
                      title: 'Radar MooSic',
                    });
                  }
                }}
                size="sm"
                accent={activeDisplayTrack.accent}
              />
              <button
                onClick={() => toggleLike(activeDisplayTrack.id)}
                className={`p-1.5 rounded-full transition-all ${
                  isLiked(activeDisplayTrack.id)
                    ? 'text-rose-500 bg-rose-500/10'
                    : 'text-text-muted hover:text-white hover:bg-white/[0.08]'
                }`}
                title="Curtir faixa"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isLiked(activeDisplayTrack.id) ? 'fill-current' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Visualizador de Espectro Harmônico */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>Ressonador Áureo</span>
            </span>
            <div className="flex items-end gap-1 h-3.5">
              {waveBars.map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-brand-purple to-brand-light transition-all duration-150"
                  style={{
                    height: isPlaying ? `${h}%` : '25%',
                    opacity: isPlaying ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. CARD: RADAR DE ARTISTAS EM ALTA ================= */}
      <div className="rounded-3xl bg-[#0D0E14] border border-white/[0.06] p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Artistas em Alta no Brasil</span>
          </h3>
          <button
            onClick={() => navigate('/app/search')}
            className="text-[10px] font-bold text-brand-light hover:text-white transition-colors flex items-center gap-0.5"
          >
            <span>Ver Todos</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {TRENDING_ARTISTS.map((artist, idx) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/app/artist/${encodeURIComponent(artist.name)}`)}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[11px] font-mono font-bold text-text-muted w-3.5 text-center">
                  #{idx + 1}
                </span>
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-sm flex-shrink-0 group-hover:border-brand-purple transition-colors">
                  <Artwork
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-light transition-colors truncate">
                    {artist.name}
                  </h4>
                  <p className="text-[10px] text-text-muted truncate">
                    {artist.genre}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {artist.trend}
                </span>
                <p className="text-[9px] text-text-muted mt-1 font-mono">
                  {artist.listeners}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 4. CARD: FILA RÁPIDA & PRÓXIMAS VIBRAÇÕES ================= */}
      {upNextList.length > 0 && (
        <div className="rounded-3xl bg-[#0D0E14] border border-white/[0.06] p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <ListMusic className="w-3.5 h-3.5 text-brand-purple" />
              <span>A Seguir na Frequência</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-text-muted">
              {manualQueue.length > 0
                ? `${manualQueue.length} manual • ${flowQueue.length} flow`
                : `${flowQueue.length} no flow`}
            </span>
          </div>

          <div className="space-y-1.5">
            {upNextList.map(({ track, badgeLabel, badgeColor }, i) => (
              <div
                key={`upnext-${track.id}-${i}`}
                onClick={() => play(track)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <Artwork
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-brand-light transition-colors truncate">
                      {track.title}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-text-muted truncate">
                        {track.artistName}
                      </p>
                      {badgeLabel && (
                        <span
                          className={`text-[8px] font-mono font-bold px-1 rounded border ${badgeColor}`}
                        >
                          {badgeLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-text-muted pl-2 flex-shrink-0">
                  {track.durationFormatted || '3:20'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. CARD: CARTOGRAFIA SONORA EXPRESS ================= */}
      <div
        onClick={() => navigate('/app/stats')}
        className="rounded-3xl bg-gradient-to-br from-brand-purple/10 via-[#0D0E14] to-[#07080B] border border-brand-purple/20 p-4 sm:p-5 space-y-3 hover:border-brand-purple/40 transition-all cursor-pointer group shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-light flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-brand-purple" />
            Cartografia Sonora
          </span>
          <span className="text-[9px] font-mono font-bold text-text-muted bg-white/[0.04] px-2 py-0.5 rounded-full">
            Seu Perfil
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white group-hover:text-brand-light transition-colors">
            Sua Identidade Harmônica
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Pico de escuta em <span className="text-white font-bold">Graves 808 & Lo-Fi Noturno</span>. Descubra sua constelação de hábitos e energia musical.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-bold text-brand-light group-hover:translate-x-0.5 transition-transform">
          <span>Abrir Cartografia Completa</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* ================= 6. PULSO COLETIVO DA COMUNIDADE ================= */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-[10px] text-text-muted font-medium">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-brand-purple" />
          <span>4.320 ouvintes em sintonia</span>
        </div>
        <span className="font-mono text-text-secondary">Pico: Noite</span>
      </div>
    </aside>
  );
};

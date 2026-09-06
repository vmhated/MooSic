import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer, usePlayerProgress } from '@/stores/playerContext';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import { LyricsPanel } from '@/components/lyrics';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Sparkles,
  Radio,
  SlidersHorizontal,
  Mic2,
} from 'lucide-react';

function hexToRgb(hex?: string): { r: number; g: number; b: number } {
  if (!hex || !hex.startsWith('#')) return { r: 139, g: 92, b: 246 };
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return { r: 139, g: 92, b: 246 };
}

export const PersistentBottomPlayer: React.FC = () => {
  const {
    currentTrack,
    playbackState,
    isPlaying,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
  } = usePlayer();

  const { currentTime, duration, progressPercent } = usePlayerProgress();

  const [showQueue, setShowQueue] = useState(false);
  const [showAudioProfile, setShowAudioProfile] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [audioProfile, setAudioProfile] = useState<'hifi' | 'spatial' | 'pure'>('spatial');

  // Geração de 32 barras de espectro animadas ao ritmo da música
  const [waveHeights, setWaveHeights] = useState<number[]>(
    Array.from({ length: 32 }, (_, i) => 25 + ((i * 17) % 55))
  );

  // Ciclo autônomo e desacoplado do timer de currentTime para não destruir/recriar o timer continuamente
  useEffect(() => {
    if (!isPlaying) return;
    let step = 0;
    const interval = setInterval(() => {
      step += 0.2;
      setWaveHeights(
        Array.from({ length: 32 }, (_, i) => {
          const base = 25 + Math.sin(step + i * 0.45) * 45;
          const jitter = Math.random() * 20;
          return Math.max(18, Math.min(92, Math.round(base + jitter)));
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentTrack) {
    return null;
  }

  const validDuration = duration > 0 ? duration : (currentTrack.durationSeconds || 30);

  const liked = isLiked(currentTrack.id);
  const accentHex = currentTrack.accent || '#8B5CF6';
  const { r, g, b } = hexToRgb(accentHex);
  // Cor secundária complementar para gradiente bi-cromático rico
  const r2 = Math.min(255, (r + 70) % 255);
  const g2 = Math.min(255, (g + 30) % 255);
  const b2 = Math.min(255, (b + 110) % 255);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const targetSeconds = (val / 100) * validDuration;
    seek(targetSeconds);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
    seek(clickPercent * validDuration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value) / 100);
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-3.5 h-3.5 text-rose-400" />;
    if (volume < 0.5) return <Volume1 className="w-3.5 h-3.5 text-text-secondary" />;
    return <Volume2 className="w-3.5 h-3.5 text-text-secondary" />;
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 inset-x-3 sm:inset-x-6 lg:inset-x-8 z-50 max-w-5xl mx-auto select-none pointer-events-none">
      {/* 1. HALO VOLUMÉTRICO EXTERNO BASEADO NA ARTE DO ÁLBUM */}
      <div
        className="absolute -inset-2 rounded-full blur-3xl opacity-50 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, rgba(${r}, ${g}, ${b}, 0.7) 0%, rgba(${r2}, ${g2}, ${b2}, 0.35) 45%, transparent 75%)`,
        }}
      />

      {/* 2. CÁPSULA COM DEGRADÊ DE CORES DINÂMICO BASEADO NA CAPA */}
      <div
        className="relative rounded-3xl sm:rounded-full backdrop-blur-3xl p-3 sm:px-6 sm:py-3 pointer-events-auto transition-all duration-500 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.32) 0%, rgba(14, 14, 20, 0.94) 45%, rgba(${r2}, ${g2}, ${b2}, 0.22) 100%)`,
          border: `1.5px solid rgba(${r}, ${g}, ${b}, 0.45)`,
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(${r}, ${g}, ${b}, 0.25)`,
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-5">

          {/* ================= 1. DISCO ORBITAL & INFORMAÇÕES (ESQUERDA) ================= */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0">
            {/* Vinil Rotativo com Núcleo Metálico */}
            <div
              className="relative flex-shrink-0 group cursor-pointer"
              onClick={() => setShowLyrics(true)}
              title="Clique para ver letras"
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden p-[2.5px] transition-all duration-500 shadow-lg ${
                  isPlaying ? 'scale-105' : ''
                }`}
                style={{
                  background: `conic-gradient(from 0deg, ${accentHex}, rgb(${r2},${g2},${b2}), #EC4899, ${accentHex})`,
                  boxShadow: isPlaying ? `0 0 16px rgba(${r}, ${g}, ${b}, 0.6)` : 'none',
                }}
              >
                <div
                  className={`w-full h-full rounded-full overflow-hidden relative ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '7s' }}
                >
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Centro do disco de vinil */}
                  <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-background border-2 border-white/80 shadow-inner flex items-center justify-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: accentHex }}
                    />
                  </div>
                </div>
              </div>

              {/* Indicador de Letras no mobile */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLyrics(true);
                }}
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black/80 border border-white/20 text-brand-light sm:hidden"
                title="Ver letras"
              >
                <Mic2 className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Título, Artista e Badge de Fidelidade */}
            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-2">
                <h4
                  onClick={() => setShowLyrics(true)}
                  className="text-xs sm:text-sm font-black text-white truncate tracking-tight hover:underline cursor-pointer"
                >
                  {currentTrack.title}
                </h4>
                <button
                  onClick={() => toggleLike(currentTrack.id)}
                  className={`p-1 transition-transform active:scale-75 ${
                    liked ? 'text-pink-500 scale-110' : 'text-text-muted hover:text-white'
                  }`}
                  aria-label="Curtir"
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => setShowLyrics(true)}
                  className="sm:hidden p-1 text-text-muted hover:text-brand-light transition-colors"
                  title="Abrir Letras"
                  aria-label="Abrir letras"
                >
                  <Mic2 className="w-3.5 h-3.5 text-brand-purple" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[11px] text-text-secondary truncate font-medium">
                  {currentTrack.artistName}
                </p>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <button
                  onClick={() => setShowAudioProfile(!showAudioProfile)}
                  className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 border"
                  style={{
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                    borderColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
                    color: '#FFFFFF',
                  }}
                >
                  <Radio className="w-2.5 h-2.5 animate-pulse text-white" />
                  <span>{audioProfile === 'spatial' ? 'Espacial 3D' : audioProfile === 'hifi' ? 'Hi-Fi 24b' : 'Puro'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= 2. CONTROLES & LINHA DO TEMPO REATIVA (CENTRO) ================= */}
          <div className="flex flex-col items-center justify-center gap-2 w-full sm:flex-1 max-w-lg px-1 sm:px-3">
            {/* Controles Principais de Áudio */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-1.5 rounded-full transition-all ${
                  isShuffle
                    ? 'text-white shadow-sm'
                    : 'text-text-muted hover:text-white'
                }`}
                style={isShuffle ? { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)` } : {}}
                title="Modo Aleatório"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              {/* Faixa Anterior */}
              <button
                onClick={previous}
                className="p-1.5 text-text-secondary hover:text-white hover:scale-115 active:scale-90 transition-transform"
                aria-label="Anterior"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Botão Central de Play / Pause */}
              <button
                onClick={togglePlay}
                className="relative group p-0.5 rounded-full focus:outline-none"
                aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {/* Pulso de luz externo sincronizado */}
                <div
                  className={`absolute -inset-1.5 rounded-full blur-md transition-opacity duration-300 ${
                    isPlaying ? 'opacity-90 animate-pulse' : 'opacity-0'
                  }`}
                  style={{
                    background: `linear-gradient(45deg, ${accentHex}, rgb(${r2},${g2},${b2}))`,
                  }}
                />

                <div
                  className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-neutral-100 text-black flex items-center justify-center shadow-xl group-hover:scale-105 active:scale-95 transition-transform"
                  style={{
                    boxShadow: `0 0 20px rgba(${r}, ${g}, ${b}, 0.5)`,
                  }}
                >
                  {playbackState === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current text-black" />
                  ) : (
                    <Play className="w-5 h-5 fill-current text-black ml-0.5" />
                  )}
                </div>
              </button>

              {/* Próxima Faixa */}
              <button
                onClick={next}
                className="p-1.5 text-text-secondary hover:text-white hover:scale-115 active:scale-90 transition-transform"
                aria-label="Próxima"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`p-1.5 rounded-full transition-all ${
                  repeatMode !== 'off'
                    ? 'text-white shadow-sm'
                    : 'text-text-muted hover:text-white'
                }`}
                style={repeatMode !== 'off' ? { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)` } : {}}
                title={`Repetição: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-3.5 h-3.5" />
                ) : (
                  <Repeat className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* MOSTRADOR DE AVANÇO E DURAÇÃO DA MÚSICA (100% FUNCIONAL E VISÍVEL) */}
            <div className="w-full flex items-center gap-2.5 sm:gap-3">
              {/* Minuto Atual */}
              <span className="text-[11px] font-mono font-bold text-white w-8 text-right tabular-nums">
                {formatSecondsToTime(currentTime)}
              </span>

              {/* Trilha de Progresso Contínua com Espectro Sobreposto */}
              <div
                onClick={handleTimelineClick}
                className="flex-1 relative h-6 flex flex-col justify-center cursor-pointer group py-1"
              >
                {/* 1. Espectro de Ondas de Áudio Reativas */}
                <div className="w-full h-3 flex items-end justify-between gap-[2px] mb-1 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  {waveHeights.map((height, idx) => {
                    const barPercent = (idx / 32) * 100;
                    const isPast = barPercent <= progressPercent;

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex items-end justify-center h-full"
                      >
                        <div
                          className="w-full rounded-full transition-all duration-150"
                          style={{
                            height: isPlaying ? `${height}%` : '25%',
                            minHeight: '2px',
                            backgroundColor: isPast ? accentHex : 'rgba(255, 255, 255, 0.2)',
                            boxShadow: isPast ? `0 0 6px ${accentHex}` : 'none',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* 2. Barra Contínua de Progresso (Trilha com Preenchimento Neon) */}
                <div className="relative w-full h-1.5 group-hover:h-2 rounded-full bg-white/15 overflow-hidden transition-all">
                  <div
                    className="h-full rounded-full transition-all duration-100 relative"
                    style={{
                      width: `${progressPercent}%`,
                      background: `linear-gradient(90deg, #FFFFFF 0%, ${accentHex} 60%, rgb(${r2},${g2},${b2}) 100%)`,
                      boxShadow: `0 0 10px ${accentHex}`,
                    }}
                  />
                </div>

                {/* 3. Manípulo (Knob) Magnético que Acompanha o Progresso */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-black/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: `calc(${progressPercent}% - 6px)`,
                  }}
                />

                {/* 4. Input Nativo de Range para Arraste Fino */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progressPercent || 0}
                  onChange={handleSeekChange}
                  aria-label="Posição na música"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
              </div>

              {/* Duração Total da Faixa */}
              <span className="text-[11px] font-mono font-bold text-white/80 w-8 text-left tabular-nums">
                {formatSecondsToTime(validDuration)}
              </span>
            </div>
          </div>

          {/* ================= 3. LETRAS, VOLUME, FILA E EFEITOS (DIREITA) ================= */}
          <div className="hidden sm:flex items-center justify-end gap-2.5 w-auto min-w-[210px]">
            {/* Botão de Letras Vivas */}
            <button
              onClick={() => setShowLyrics(true)}
              className="px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
              style={{
                backgroundColor: showLyrics ? `rgba(${r}, ${g}, ${b}, 0.35)` : 'rgba(255, 255, 255, 0.06)',
                borderColor: showLyrics ? accentHex : 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                boxShadow: showLyrics ? `0 0 14px rgba(${r}, ${g}, ${b}, 0.4)` : 'none',
              }}
              title="Abrir Letras Sincronizadas"
              aria-label="Ver letras da música"
            >
              <Mic2 className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-black uppercase tracking-wider">Letras</span>
            </button>

            {/* Ajustes de Áudio */}
            <button
              onClick={() => setShowAudioProfile(!showAudioProfile)}
              className="p-2 rounded-full border transition-all"
              style={{
                backgroundColor: showAudioProfile ? `rgba(${r}, ${g}, ${b}, 0.3)` : 'rgba(255, 255, 255, 0.05)',
                borderColor: showAudioProfile ? accentHex : 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
              }}
              title="Ajustes de Áudio Espacial"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Fila de Reprodução */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className="p-2 rounded-full border transition-all relative"
              style={{
                backgroundColor: showQueue ? `rgba(${r}, ${g}, ${b}, 0.3)` : 'rgba(255, 255, 255, 0.05)',
                borderColor: showQueue ? accentHex : 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
              }}
              title="Fila de Reprodução"
            >
              <ListMusic className="w-3.5 h-3.5" />
              {queue.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-white text-[9px] font-black flex items-center justify-center shadow"
                  style={{ backgroundColor: accentHex }}
                >
                  {queue.length}
                </span>
              )}
            </button>

            {/* Controle de Volume */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/25 border border-white/10">
              <button
                onClick={toggleMute}
                className="hover:scale-110 active:scale-95 transition-transform"
                aria-label="Mutar volume"
              >
                {renderVolumeIcon()}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : Math.round(volume * 100)}
                onChange={handleVolumeChange}
                aria-label="Controle de volume"
                className="w-14 lg:w-16 h-1 bg-white/20 hover:bg-white/40 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: accentHex }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL DE PERFIL DE ÁUDIO ESPACIAL ================= */}
      <AnimatePresence>
        {showAudioProfile && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            className="absolute bottom-20 right-4 sm:right-16 z-50 w-72 rounded-2xl bg-surface-elevated/95 backdrop-blur-3xl border border-white/15 p-4 shadow-2xl space-y-3 pointer-events-auto"
            style={{
              borderColor: `rgba(${r}, ${g}, ${b}, 0.35)`,
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: accentHex }} />
                Motor de Áudio MooSic
              </span>
              <button
                onClick={() => setShowAudioProfile(false)}
                className="text-[11px] text-text-muted hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'spatial', title: 'Áudio Espacial 3D', desc: 'Campo sonoro imersivo 360°' },
                { id: 'hifi', title: 'Hi-Fi Studio Master', desc: 'Resposta plana e dinâmica pura' },
                { id: 'pure', title: 'Frequência Noturna', desc: 'Graves aveludados e agudos suaves' },
              ].map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    setAudioProfile(prof.id as any);
                    setShowAudioProfile(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl border transition-all"
                  style={
                    audioProfile === prof.id
                      ? {
                          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)`,
                          borderColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
                          color: '#FFFFFF',
                        }
                      : { borderColor: 'transparent', color: '#B8B8C2' }
                  }
                >
                  <p className="text-xs font-bold text-white">{prof.title}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{prof.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL DE FILA DE REPRODUÇÃO ================= */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            className="absolute bottom-20 right-4 sm:right-6 z-50 w-80 sm:w-96 max-h-96 rounded-2xl bg-surface-elevated/95 backdrop-blur-3xl border border-white/15 p-4 shadow-2xl space-y-3 overflow-hidden flex flex-col pointer-events-auto"
            style={{
              borderColor: `rgba(${r}, ${g}, ${b}, 0.35)`,
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4" style={{ color: accentHex }} />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Fila do Fluxo Sonoro ({queue.length})
                </h3>
              </div>
              <button
                onClick={() => setShowQueue(false)}
                className="text-xs text-text-muted hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {queue.length === 0 ? (
                <p className="text-text-muted py-6 text-center text-xs">
                  Sua fila está vazia. Toque em qualquer faixa para adicioná-la!
                </p>
              ) : (
                queue.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                      currentTrack.id === item.id
                        ? 'bg-white/10 text-white font-bold'
                        : 'hover:bg-white/5 text-text-secondary'
                    }`}
                    style={
                      currentTrack.id === item.id
                        ? {
                            border: `1px solid rgba(${r}, ${g}, ${b}, 0.5)`,
                            backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                          }
                        : {}
                    }
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white">{item.title}</p>
                      <p className="truncate text-[11px] text-text-muted">{item.artistName}</p>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono">
                      {formatSecondsToTime(item.durationSeconds || 30)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PAINEL DE LETRAS VIVAS SINCRONIZADAS ================= */}
      <LyricsPanel isOpen={showLyrics} onClose={() => setShowLyrics(false)} />
    </div>
  );
};

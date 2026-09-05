import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/stores/playerContext';
import { useLyrics } from '@/hooks/useLyrics';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import {
  X,
  Mic2,
  MicOff,
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  AlignLeft,
  FastForward,
  Rewind,
} from 'lucide-react';

interface LyricsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.replace(/[\[\]]/g, '').trim();
  const parts = cleaned.split(':');
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]) || 0;
    const secs = parseFloat(parts[2]) || 0;
    return hours * 3600 + mins * 60 + secs;
  }
  const direct = parseFloat(cleaned);
  return isNaN(direct) ? 0 : direct;
}

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

export const LyricsPanel: React.FC<LyricsPanelProps> = ({ isOpen, onClose }) => {
  const {
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    togglePlay,
    next,
    previous,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = usePlayer();

  const { lines, loading, isRealSynced, hasLyrics } = useLyrics(currentTrack || ({} as any));
  const [syncOffset, setSyncOffset] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('large');
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const accentHex = currentTrack?.accent || '#8B5CF6';
  const { r, g, b } = hexToRgb(accentHex);
  const r2 = Math.min(255, (r + 75) % 255);
  const g2 = Math.min(255, (g + 35) % 255);
  const b2 = Math.min(255, (b + 120) % 255);

  const validDuration = duration > 0 ? duration : (currentTrack?.durationSeconds || 30);
  const progressPercent = Math.min(100, Math.max(0, (currentTime / validDuration) * 100));

  // Controle refinado de interação manual do usuário (wheel, touch, drag)
  const isUserInteractingRef = useRef<boolean>(false);
  const userInteractionTimeoutRef = useRef<any>(null);

  const handleUserInteractionStart = () => {
    isUserInteractingRef.current = true;
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    // Retoma o acompanhamento automático 3 segundos após cessar a interação física do usuário
    userInteractionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 3000);
  };

  // Determina o verso ativo com base no tempo real de reprodução
  let activeIndex = -1;
  if (lines.length > 0) {
    const effectivePlaybackTime = Math.max(0, currentTime + syncOffset);
    const parsedLineTimes = lines.map((l) => parseTimeToSeconds(l.time));

    let bestIdx = -1;
    for (let i = 0; i < parsedLineTimes.length; i++) {
      const t = parsedLineTimes[i];
      if (!isNaN(t) && effectivePlaybackTime >= t) {
        bestIdx = i;
      }
    }
    activeIndex = bestIdx;
  }

  // Auto-scroll contínuo e preciso que acompanha o verso ativo em tempo real
  useEffect(() => {
    if (isUserInteractingRef.current || activeIndex < 0) return;

    const container = containerRef.current;
    const activeEl = activeLineRef.current;
    if (!container || !activeEl) return;

    // Medição rigorosa de coordenadas via getBoundingClientRect (imune a distorções de scale e offsetParent)
    const activeRect = activeEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Distância exata do verso em relação ao topo do conteúdo rolável do container
    const activeRelativeTop = activeRect.top - containerRect.top + container.scrollTop;

    // Posiciona o verso ativo a 35% do topo visível do container
    const targetScroll = activeRelativeTop - container.clientHeight * 0.35 + activeRect.height / 2;

    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [activeIndex]);

  // Trava o scroll da página enquanto o painel de letras estiver visível
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!currentTrack) return null;

  const handleLineClick = (_idx: number, timeStr: string) => {
    const lineSec = parseTimeToSeconds(timeStr);
    isUserInteractingRef.current = false; // Retoma imediatamente o auto-scroll ao clicar no verso
    seek(lineSec);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
    isUserInteractingRef.current = false;
    seek(clickPercent * validDuration);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: '100%' }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          className="fixed inset-0 z-[70] bg-[#070709] text-white flex flex-col justify-between overflow-hidden select-none pointer-events-auto"
        >
          {/* ================= FUNDO KINÉTICO COM NÉBULA DINÂMICA ================= */}
          <div
            className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[170px] pointer-events-none opacity-35 transition-all duration-1000 -z-10"
            style={{
              background: `radial-gradient(circle, ${accentHex} 0%, rgba(${r}, ${g}, ${b}, 0.2) 60%, transparent 80%)`,
            }}
          />
          <div
            className="absolute -bottom-32 -right-32 w-[750px] h-[750px] rounded-full blur-[200px] pointer-events-none opacity-30 transition-all duration-1000 -z-10"
            style={{
              background: `radial-gradient(circle, rgb(${r2}, ${g2}, ${b2}) 0%, rgba(${r}, ${g}, ${b}, 0.15) 50%, transparent 80%)`,
            }}
          />

          {/* ================= 1. CABEÇALHO SUPERIOR TRANSLÚCIDO ================= */}
          <header className="px-6 sm:px-10 py-4 sm:py-5 flex items-center justify-between border-b border-white/[0.08] bg-black/20 backdrop-blur-xl z-20">
            {/* Tag de identificação e status de sincronização */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border"
                style={{
                  backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)`,
                  borderColor: `rgba(${r}, ${g}, ${b}, 0.45)`,
                }}
              >
                <Mic2 className="w-4 h-4" style={{ color: accentHex }} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Letras Vivas MooSic
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                      borderColor: `rgba(${r}, ${g}, ${b}, 0.35)`,
                      color: '#FFFFFF',
                    }}
                  >
                    {isRealSynced ? 'Karaokê em Tempo Real' : 'Sincronização Dinâmica'}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  {currentTrack.title} • {currentTrack.artistName}
                </p>
              </div>
            </div>

            {/* Ações: Ajuste de Offset, Tamanho da Fonte e Fechar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Controle de Ajuste de Sincronia (Offset) */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs">
                <span className="text-[10px] text-text-muted font-bold uppercase">Sincronia:</span>
                <button
                  onClick={() => setSyncOffset((prev) => prev - 1)}
                  className="p-1 hover:text-brand-light transition-colors"
                  title="Atrasar 1 segundo"
                >
                  <Rewind className="w-3 h-3" />
                </button>
                <span className="font-mono text-[11px] w-8 text-center text-white">
                  {syncOffset >= 0 ? `+${syncOffset}s` : `${syncOffset}s`}
                </span>
                <button
                  onClick={() => setSyncOffset((prev) => prev + 1)}
                  className="p-1 hover:text-brand-light transition-colors"
                  title="Adiantar 1 segundo"
                >
                  <FastForward className="w-3 h-3" />
                </button>
              </div>

              {/* Alternar Tamanho de Fonte */}
              <button
                onClick={() => setFontSize(fontSize === 'large' ? 'normal' : 'large')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-text-secondary hover:text-white transition-all"
                title="Alternar tamanho da letra"
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold">{fontSize === 'large' ? 'Grande' : 'Médio'}</span>
              </button>

              {/* Botão Fechar com Glow */}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white transition-all hover:scale-105 active:scale-95 shadow-lg group"
                aria-label="Fechar painel de letras"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </header>

          {/* ================= 2. CORPO DO PAINEL: LAYOUT SPLIT / VISUALIZADOR ================= */}
          <div
            className={`flex-1 overflow-hidden px-6 sm:px-12 lg:px-16 py-6 max-w-7xl mx-auto w-full ${
              hasLyrics && lines.length > 0
                ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'
                : 'flex flex-col items-center justify-center my-auto'
            }`}
          >
            {/* BLOCO DA MÚSICA: Capa High-Res, Vinil Concêntrico e Informações Centrais */}
            <div
              className={`flex flex-col justify-center items-center text-center space-y-4 sm:space-y-5 lg:space-y-6 select-none w-full mx-auto my-auto ${
                hasLyrics && lines.length > 0
                  ? 'col-span-1 lg:col-span-5 px-4 lg:px-6'
                  : 'max-w-2xl py-4'
              }`}
            >
              {/* Arte com Vinil Giratório Flutuante Centralizado */}
              <div className="relative flex items-center justify-center my-1">
                {/* Disco de Vinil Concêntrico em Rotação Suave projetando-se atrás da capa */}
                <div
                  className={`absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-[320px] lg:h-[320px] xl:w-[370px] xl:h-[370px] rounded-full bg-[#0a0a0c] border-4 border-white/10 shadow-2xl flex items-center justify-center transition-all duration-700 pointer-events-none ${
                    isPlaying ? 'scale-105 opacity-90' : 'scale-95 opacity-60'
                  }`}
                  style={{
                    boxShadow: `0 0 50px rgba(${r}, ${g}, ${b}, 0.35)`,
                  }}
                >
                  <div
                    className={`w-full h-full rounded-full border border-white/10 flex items-center justify-center relative ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '10s' }}
                  >
                    {/* Ranhuras e sulcos do vinil de alta fidelidade */}
                    <div className="absolute inset-4 rounded-full border border-white/[0.05]" />
                    <div className="absolute inset-8 rounded-full border border-white/[0.05]" />
                    <div className="absolute inset-12 rounded-full border border-white/[0.06]" />
                    <div className="absolute inset-16 rounded-full border border-white/[0.07]" />
                    <div className="absolute inset-20 rounded-full border border-white/[0.05]" />
                    <div className="absolute inset-24 rounded-full border border-white/[0.06]" />

                    {/* Selo Central com Cor Dinâmica da Capa */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/40 shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: accentHex }}
                    >
                      <div className="w-5 h-5 rounded-full bg-background border-2 border-white/80 shadow-md" />
                    </div>
                  </div>
                </div>

                {/* Capa Principal em Alta Resolução Proporcionalmente Aumentada */}
                <div
                  className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-[290px] lg:h-[290px] xl:w-[330px] xl:h-[330px] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/20 transition-transform duration-500 hover:scale-[1.02] z-10"
                  style={{
                    boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 45px rgba(${r}, ${g}, ${b}, 0.45)`,
                  }}
                >
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Informações da Música Centralizadas e Proporcionalmente Escalonadas */}
              <div className="space-y-1 sm:space-y-1.5 max-w-md mx-auto">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight line-clamp-2">
                  {currentTrack.title}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-text-secondary tracking-wide">
                  {currentTrack.artistName}
                </p>
                <p className="text-xs sm:text-sm text-text-muted font-semibold">
                  {currentTrack.albumTitle || 'Álbum Oficial'}
                </p>
              </div>

              {/* Badge de Duração & Qualidade */}
              <div className="flex flex-col items-center gap-2 pt-0.5">
                <span
                  className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-md"
                  style={{
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)`,
                    borderColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                    color: '#FFFFFF',
                  }}
                >
                  Master Hi-Res • 24b / 96kHz
                </span>

                {(!hasLyrics || lines.length === 0) && !loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 mt-4 px-6 py-5 rounded-3xl bg-white/[0.04] border border-white/10 text-center max-w-md backdrop-blur-xl shadow-2xl"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg"
                      style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.25)` }}
                    >
                      <MicOff className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        Ainda não sabemos cantar essa
                      </h4>
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                        Esta faixa é instrumental ou suas letras ainda não foram catalogadas em nosso acervo. Aproveite a melodia!
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* COLUNA DIREITA: O STREAM DE LETRAS KINÉTICAS SINCRONIZADAS (se houver letras) */}
            {hasLyrics && lines.length > 0 && (
              <main
                ref={containerRef}
                onWheel={handleUserInteractionStart}
                onTouchMove={handleUserInteractionStart}
                onPointerDown={handleUserInteractionStart}
                className="col-span-1 lg:col-span-7 overflow-y-auto h-full pr-2 sm:pr-6 py-16 scrollbar-none flex flex-col space-y-6 sm:space-y-8 relative"
              >
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 py-24 text-center">
                  <div
                    className="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: accentHex, borderTopColor: 'transparent' }}
                  />
                  <p className="text-sm font-bold text-white tracking-wide">
                    Sincronizando frequências vocais da faixa...
                  </p>
                  <p className="text-xs text-text-muted">
                    Buscando estrofes e timestamps oficiais no LRCLIB
                  </p>
                </div>
              ) : !hasLyrics || lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-5 py-24 text-center">
                  <div
                    className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-brand-light shadow-xl"
                    style={{
                      boxShadow: `0 10px 30px rgba(${r}, ${g}, ${b}, 0.25)`,
                    }}
                  >
                    <MicOff className="w-8 h-8 opacity-80" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <h4 className="text-xl font-bold text-white">Ainda não sabemos cantar essa</h4>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Esta música ainda não possui letra sincronizada cadastrada ou é uma composição puramente instrumental.
                    </p>
                  </div>
                </div>
              ) : (
                lines.map((line, idx) => {
                  const isActive = idx === activeIndex;
                  const isPast = idx < activeIndex;

                  return (
                    <motion.div
                      key={`${line.time}-${idx}`}
                      ref={isActive ? activeLineRef : null}
                      onClick={() => handleLineClick(idx, line.time)}
                      className={`cursor-pointer transition-all duration-300 rounded-2xl px-4 py-2 relative group select-text ${
                        isActive
                          ? 'scale-[1.03] origin-left'
                          : isPast
                          ? 'opacity-30 hover:opacity-75 blur-[0.4px]'
                          : 'opacity-40 hover:opacity-85'
                      }`}
                    >
                      {/* Glow de fundo do verso ativo */}
                      {isActive && (
                        <div
                          className="absolute -inset-1 rounded-2xl blur-xl opacity-30 pointer-events-none transition-all duration-500"
                          style={{
                            background: `radial-gradient(ellipse at center, ${accentHex} 0%, transparent 80%)`,
                          }}
                        />
                      )}

                      <div className="relative">
                        <p
                          className={`font-black tracking-tight leading-relaxed transition-all duration-300 ${
                            fontSize === 'large'
                              ? 'text-2xl sm:text-4xl lg:text-5xl'
                              : 'text-xl sm:text-2xl lg:text-3xl'
                          }`}
                          style={{
                            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                            textShadow: isActive ? `0 0 25px rgba(${r}, ${g}, ${b}, 0.8)` : 'none',
                          }}
                        >
                          {line.text}

                          {isActive && (
                            <span
                              className="ml-3.5 inline-block align-middle text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow"
                              style={{
                                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
                                borderColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
                                color: '#FFFFFF',
                              }}
                            >
                              {line.time}
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </main>
            )}
          </div>

          {/* ================= 3. BARRA DE CONTROLES FLUTUANTE INFERIOR ================= */}
          <footer className="px-6 sm:px-12 py-4 border-t border-white/[0.08] bg-black/40 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            {/* Esquerda: Tempo Decorrido & Scrubber Slider Integrado */}
            <div className="w-full sm:w-1/3 flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-white w-8 text-right tabular-nums">
                {formatSecondsToTime(currentTime)}
              </span>

              {/* Timeline Clicável */}
              <div
                onClick={handleTimelineClick}
                className="flex-1 relative h-2 bg-white/15 hover:bg-white/25 rounded-full overflow-hidden cursor-pointer group"
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, #FFFFFF 0%, ${accentHex} 70%, rgb(${r2},${g2},${b2}) 100%)`,
                    boxShadow: `0 0 10px ${accentHex}`,
                  }}
                />
              </div>

              <span className="text-xs font-mono font-bold text-white/80 w-8 text-left tabular-nums">
                {formatSecondsToTime(validDuration)}
              </span>
            </div>

            {/* Centro: Controles de Reprodução */}
            <div className="flex items-center gap-5">
              <button
                onClick={previous}
                className="p-2 text-text-secondary hover:text-white hover:scale-115 active:scale-95 transition-all"
                aria-label="Faixa anterior"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="relative p-0.5 rounded-full"
                aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                <div
                  className="w-12 h-12 rounded-full bg-white hover:bg-neutral-100 text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                  style={{
                    boxShadow: `0 0 20px rgba(${r}, ${g}, ${b}, 0.6)`,
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current text-black" />
                  ) : (
                    <Play className="w-5 h-5 fill-current text-black ml-0.5" />
                  )}
                </div>
              </button>

              <button
                onClick={next}
                className="p-2 text-text-secondary hover:text-white hover:scale-115 active:scale-95 transition-all"
                aria-label="Próxima faixa"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Direita: Volume & Voltar */}
            <div className="hidden sm:flex items-center justify-end gap-4 w-1/3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10">
                <button
                  onClick={toggleMute}
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : Math.round(volume * 100)}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  aria-label="Volume"
                  className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: accentHex }}
                />
              </div>

              <button
                onClick={onClose}
                className="text-xs font-black uppercase tracking-wider text-white hover:underline flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: accentHex }} />
                <span>Voltar ao Player</span>
              </button>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer, usePlayerProgress } from '@/stores/playerContext';
import { useLyrics } from '@/hooks/useLyrics';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';
import { SyncedCover } from '@/components/ui/SyncedCover';
import { FlowRecommendationReason } from '@/types/domain/flow';
import {
  X,
  Mic2,
  MicOff,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  AlignLeft,
  FastForward,
  Rewind,
  ListMusic,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Sparkles,
  RefreshCw,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  History,
} from 'lucide-react';

interface LyricsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'lyrics' | 'queue';
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

function getReasonBadge(reason?: FlowRecommendationReason): { label: string; color: string; bg: string } {
  switch (reason) {
    case 'same_artist':
      return {
        label: 'Mesmo Artista',
        color: 'text-brand-light',
        bg: 'bg-brand-purple/15 border-brand-purple/30',
      };
    case 'related_artist':
      return {
        label: 'Artista Relacionado',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/15 border-cyan-500/30',
      };
    case 'same_genre':
      return {
        label: 'Mesmo Gênero',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15 border-emerald-500/30',
      };
    case 'discovery':
    default:
      return {
        label: 'Descoberta',
        color: 'text-amber-400',
        bg: 'bg-amber-500/15 border-amber-500/30',
      };
  }
}

export const LyricsPanel: React.FC<LyricsPanelProps> = ({ isOpen, onClose, initialTab = 'lyrics' }) => {
  const {
    currentTrack,
    isPlaying,
    manualQueue,
    flowQueue,
    queueHistory,
    flowSeed,
    isFlowGenerating,
    play,
    togglePlay,
    next,
    previous,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    toggleLike,
    isLiked,
    removeFromQueue,
    reorderManualQueue,
    promoteFlowToManual,
    clearManualQueue,
    regenerateFlow,
  } = usePlayer();

  const { currentTime, duration, progressPercent } = usePlayerProgress();

  const [activeTab, setActiveTab] = useState<'lyrics' | 'queue'>(initialTab);
  const { lines, loading, hasLyrics } = useLyrics(currentTrack || ({} as any));
  const [syncOffset, setSyncOffset] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('large');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const accentHex = currentTrack?.accent || '#8B5CF6';
  const { r, g, b } = hexToRgb(accentHex);
  const r2 = Math.min(255, (r + 75) % 255);
  const g2 = Math.min(255, (g + 35) % 255);
  const b2 = Math.min(255, (b + 120) % 255);

  const validDuration = duration > 0 ? duration : (currentTrack?.durationSeconds || 30);
  const isCurrentLiked = currentTrack ? isLiked(currentTrack.id) : false;

  // Controle de interação manual do usuário
  const isUserInteractingRef = useRef<boolean>(false);
  const userInteractionTimeoutRef = useRef<any>(null);

  const handleUserInteractionStart = () => {
    isUserInteractingRef.current = true;
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 3500);
  };

  // Determina verso ativo
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

  // Auto-scroll robusto usando offsetTop
  useEffect(() => {
    if (isUserInteractingRef.current || activeIndex < 0 || activeTab !== 'lyrics') return;

    const container = containerRef.current;
    const activeEl = activeLineRef.current;
    if (!container || !activeEl) return;

    // offsetTop é a distância real do topo do container (pois o main tem position: relative).
    // Isso é super estável e não buga com animações de scale do framer-motion.
    const targetScroll = activeEl.offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2;

    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [activeIndex, activeTab]);

  // Trava o scroll da página
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
    isUserInteractingRef.current = false;
    seek(lineSec);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
    isUserInteractingRef.current = false;
    seek(clickPercent * validDuration);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seek((val / 100) * validDuration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value) / 100);
  };

  const handleRegenerateClick = async () => {
    setIsRegenerating(true);
    await regenerateFlow();
    setTimeout(() => setIsRegenerating(false), 500);
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
            className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[170px] pointer-events-none opacity-30 transition-all duration-1000 -z-10"
            style={{
              background: `radial-gradient(circle, ${accentHex} 0%, rgba(${r}, ${g}, ${b}, 0.2) 60%, transparent 80%)`,
            }}
          />
          <div
            className="absolute -bottom-32 -right-32 w-[750px] h-[750px] rounded-full blur-[200px] pointer-events-none opacity-25 transition-all duration-1000 -z-10"
            style={{
              background: `radial-gradient(circle, rgb(${r2}, ${g2}, ${b2}) 0%, rgba(${r}, ${g}, ${b}, 0.15) 50%, transparent 80%)`,
            }}
          />

          {/* ================= 1. CABEÇALHO SUPERIOR TRANSLÚCIDO ================= */}
          <header className="px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-white/[0.08] bg-black/30 backdrop-blur-xl z-20">
            {/* Abas Superiores: Letras Vivas | Fila & Fluxo */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.05] border border-white/10">
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'lyrics'
                    ? 'bg-brand-purple text-white shadow-glow'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>Letras Vivas</span>
              </button>

              <button
                onClick={() => setActiveTab('queue')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'queue'
                    ? 'bg-brand-purple text-white shadow-glow'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>Fila & Fluxo</span>
                {manualQueue.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center">
                    {manualQueue.length}
                  </span>
                )}
              </button>
            </div>

            {/* Controles de Letra / Fechar */}
            <div className="flex items-center gap-3">
              {activeTab === 'lyrics' && (
                <>
                  <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-xl text-xs text-text-muted">
                    <span>Sincronia:</span>
                    <button
                      onClick={() => setSyncOffset((prev) => Math.max(-5, prev - 0.5))}
                      className="p-1 hover:text-white transition-colors"
                      title="Atrasar letra 0.5s"
                    >
                      <Rewind className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-white text-[11px] w-10 text-center">
                      {syncOffset > 0 ? `+${syncOffset.toFixed(1)}s` : `${syncOffset.toFixed(1)}s`}
                    </span>
                    <button
                      onClick={() => setSyncOffset((prev) => Math.min(5, prev + 0.5))}
                      className="p-1 hover:text-white transition-colors"
                      title="Adiantar letra 0.5s"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'))}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-text-secondary hover:text-white border border-white/10 transition-all"
                    title="Alternar tamanho da tipografia"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-text-muted hover:text-white border border-white/10 transition-all active:scale-95"
                title="Fechar Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* ================= 2. CORPO PRINCIPAL ================= */}
          {activeTab === 'lyrics' ? (
            /* ================= VISUALIZAÇÃO DE LETRAS VIVAS ================= */
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 px-4 sm:px-10 py-6 max-w-[1400px] mx-auto w-full items-center">
              {/* Lado Esquerdo: Capa Flutuante & Informações */}
              <div className="col-span-1 lg:col-span-5 flex flex-col items-center text-center space-y-8 select-none">
                
                {/* Capa Principal Flutuante (Premium Apple Music Style) */}
                <div
                  className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden transition-transform duration-700 hover:scale-[1.02] z-10"
                  style={{
                    boxShadow: `0 35px 60px -15px rgba(0,0,0,0.9), 0 0 80px rgba(${r}, ${g}, ${b}, 0.35)`,
                  }}
                >
                  <SyncedCover
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none mix-blend-overlay" />
                </div>

                {/* Título & Artista */}
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight line-clamp-2">
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-text-secondary tracking-wide">
                    {currentTrack.artistName}
                  </p>
                  <p className="text-xs text-text-muted font-medium">
                    {currentTrack.albumTitle || 'Álbum Oficial'}
                  </p>
                </div>

                {/* Status de instrumental ou sem letra */}
                {(!hasLyrics || lines.length === 0) && !loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-2 mt-3 px-6 py-4 rounded-3xl bg-white/[0.04] border border-white/10 text-center max-w-sm backdrop-blur-xl shadow-xl"
                  >
                    <MicOff className="w-6 h-6 text-brand-light mb-1" />
                    <h4 className="text-base font-bold text-white tracking-tight">
                      Ainda não sabemos cantar essa
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Esta faixa é instrumental ou suas letras ainda não foram catalogadas. Aproveite a melodia!
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Lado Direito: Stream de Letras Sincronizadas */}
              {hasLyrics && lines.length > 0 && (
                <main
                  ref={containerRef}
                  onWheel={handleUserInteractionStart}
                  onTouchMove={handleUserInteractionStart}
                  onPointerDown={handleUserInteractionStart}
                  className="col-span-1 lg:col-span-7 overflow-y-auto h-full pr-2 sm:pr-6 py-[15vh] scrollbar-none flex flex-col space-y-6 sm:space-y-7 relative"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                  }}
                >
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3 py-20 text-center">
                      <div className="w-10 h-10 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-bold text-white">Sintonizando frequências vocais...</p>
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
                          className={`cursor-pointer transition-all duration-500 ease-out rounded-2xl p-2 sm:p-3 select-none text-left ${
                            isActive
                              ? 'scale-105 font-black text-white pl-4 sm:pl-6'
                              : isPast
                              ? 'text-white/30 hover:text-white/60 font-semibold blur-[0.5px]'
                              : 'text-white/30 hover:text-white/60 font-semibold blur-[0.5px]'
                          }`}
                          style={{
                            textShadow: isActive ? `0 0 35px rgba(${r}, ${g}, ${b}, 0.9)` : 'none',
                            color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                          }}
                        >
                          <p
                            className={
                              fontSize === 'large'
                                ? 'text-lg sm:text-2xl lg:text-3xl leading-snug tracking-tight'
                                : 'text-base sm:text-lg lg:text-xl leading-snug tracking-tight'
                            }
                          >
                            {line.text || '♪'}
                          </p>
                        </motion.div>
                      );
                    })
                  )}
                </main>
              )}
            </div>
          ) : (
            /* ================= VISUALIZAÇÃO DE FILA INTELIGENTE & MOOSIC FLOW ================= */
            <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-6 max-w-4xl mx-auto w-full space-y-8 scrollbar-none">
              {/* 1. FAIXA EM REPRODUÇÃO ATUAL */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-text-muted">
                  Tocando Agora
                </span>
                <div
                  className="p-3.5 sm:p-4 rounded-3xl flex items-center justify-between gap-4 border shadow-surface"
                  style={{
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
                    borderColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <SyncedCover
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="w-14 h-14 rounded-2xl shadow-md border border-white/10"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-sm sm:text-base font-black text-white truncate">
                          {currentTrack.title}
                        </p>
                      </div>
                      <p className="text-xs text-brand-light truncate font-semibold">
                        {currentTrack.artistName}
                      </p>
                      <p className="text-[10px] text-text-muted truncate font-mono">
                        {currentTrack.albumTitle || 'Álbum Oficial'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/80 tabular-nums">
                    {formatSecondsToTime(currentTime)} / {formatSecondsToTime(validDuration)}
                  </span>
                </div>
              </div>

              {/* 2. FILA MANUAL DO USUÁRIO ("SUA ESCOLHA") */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Fila Manual
                    </span>
                    <span className="text-[10px] font-mono font-bold text-text-muted bg-white/[0.06] px-2 py-0.5 rounded-full">
                      {manualQueue.length} {manualQueue.length === 1 ? 'faixa' : 'faixas'}
                    </span>
                  </div>

                  {manualQueue.length > 0 && (
                    <button
                      onClick={() => clearManualQueue()}
                      className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpar Fila Manual</span>
                    </button>
                  )}
                </div>

                {manualQueue.length === 0 ? (
                  <div className="px-4 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <p className="text-xs text-text-muted">
                      Nenhuma música colocada manualmente. Use <span className="text-white font-bold">"Tocar em seguida"</span> ou <span className="text-white font-bold">"Adicionar à fila"</span> em qualquer faixa.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {manualQueue.map((track, idx) => (
                      <div
                        key={`manual-q-${track.id}-${idx}`}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all group"
                      >
                        <div
                          onClick={() => {
                            // Toca a faixa manual clicada
                            const targetTrack = manualQueue[idx];
                            const remaining = manualQueue.filter((_, i) => i !== idx);
                            clearManualQueue();
                            remaining.forEach((t) => manualQueue.push(t));
                            play(targetTrack);
                          }}
                          className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                        >
                          <span className="text-xs font-mono text-text-muted w-5 text-center">
                            #{idx + 1}
                          </span>
                          <SyncedCover
                            src={track.coverUrl}
                            alt={track.title}
                            className="w-10 h-10 rounded-xl flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate text-white group-hover:text-brand-light transition-colors">
                              {track.title}
                            </p>
                            <p className="text-[11px] text-text-muted truncate">
                              {track.artistName}
                            </p>
                          </div>
                        </div>

                        {/* Ações de Reordenação e Remoção */}
                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              onClick={() => reorderManualQueue(idx, idx - 1)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                              title="Mover para cima"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < manualQueue.length - 1 && (
                            <button
                              onClick={() => reorderManualQueue(idx, idx + 1)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                              title="Mover para baixo"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => removeFromQueue(idx, 'manual')}
                            className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Remover da fila manual"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] font-mono text-text-muted pl-2 w-10 text-right">
                            {formatSecondsToTime(track.durationSeconds || 30)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. MOOSIC FLOW (CONTINUAÇÃO AUTOMÁTICA INTELIGENTE) */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-light" />
                      <span className="text-xs font-black uppercase tracking-wider text-white">
                        MooSic Flow
                      </span>
                      <span className="text-[10px] font-mono text-brand-light bg-brand-purple/20 px-2 py-0.5 rounded-full border border-brand-purple/30">
                        {flowQueue.length} sugestões ativas
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Sintonizado a partir de{' '}
                      <span className="text-white font-bold">
                        "{flowSeed?.title || currentTrack?.title}"
                      </span>{' '}
                      por{' '}
                      <span className="text-text-secondary">
                        {flowSeed?.artistName || currentTrack?.artistName}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={handleRegenerateClick}
                    disabled={isFlowGenerating || isRegenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-text-secondary hover:text-white transition-all self-start sm:self-auto active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${
                        isFlowGenerating || isRegenerating ? 'animate-spin text-brand-light' : ''
                      }`}
                    />
                    <span>Regenerar Flow</span>
                  </button>
                </div>

                {flowQueue.length === 0 ? (
                  <div className="py-8 text-center space-y-2 bg-white/[0.02] rounded-3xl border border-white/[0.04]">
                    <div className="w-6 h-6 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-text-muted">
                      Calibrando trajetória harmônica e afinidades...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {flowQueue.map((track, idx) => {
                      const badge = getReasonBadge(track.flowReason);
                      return (
                        <div
                          key={`flow-item-${track.id}-${idx}`}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/10 transition-all group"
                        >
                          <div
                            onClick={() => {
                              const target = flowQueue[idx];
                              play(target, { type: 'flow', title: 'MooSic Flow' });
                            }}
                            className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                          >
                            <span className="text-xs font-mono text-text-muted w-5 text-center">
                              {idx + 1}
                            </span>
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 space-y-0.5">
                              <p className="text-xs font-bold truncate text-white group-hover:text-brand-light transition-colors">
                                {track.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-[11px] text-text-muted truncate">
                                  {track.artistName}
                                </p>
                                <span
                                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.color}`}
                                >
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Ações: Promover para Manual ou Pular */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => promoteFlowToManual(idx)}
                              className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 text-[10px] font-bold text-text-secondary hover:text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
                              title="Fixar na Fila Manual"
                            >
                              <Plus className="w-3 h-3" />
                              <span className="hidden sm:inline">Fixar</span>
                            </button>

                            <button
                              onClick={() => removeFromQueue(idx, 'flow')}
                              className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                              title="Remover sugestão"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <span className="text-[11px] font-mono text-text-muted pl-1 w-10 text-right">
                              {formatSecondsToTime(track.durationSeconds || 30)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. HISTÓRICO RECENTE (OPCIONAL / EXPANSÍVEL) */}
              {queueHistory.length > 0 && (
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <button
                    onClick={() => setShowHistory((prev) => !prev)}
                    className="flex items-center justify-between w-full text-xs font-bold text-text-muted hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      <span>Reproduzidas Recentemente nesta Sessão ({queueHistory.length})</span>
                    </span>
                    <span>{showHistory ? 'Ocultar' : 'Exibir'}</span>
                  </button>

                  {showHistory && (
                    <div className="space-y-1 pt-2">
                      {queueHistory
                        .slice(-6)
                        .reverse()
                        .map((track, i) => (
                          <div
                            key={`hist-${track.id}-${i}`}
                            onClick={() => play(track)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] text-text-muted hover:text-white cursor-pointer transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                className="w-7 h-7 rounded-lg object-cover opacity-70"
                              />
                              <div className="min-w-0">
                                <p className="truncate font-semibold">{track.title}</p>
                                <p className="text-[10px] text-text-muted truncate">{track.artistName}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono">
                              {formatSecondsToTime(track.durationSeconds || 30)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= 3. CONTROLES DO PLAYER INTEGRADOS NO RODAPÉ ================= */}
          <footer className="px-4 sm:px-8 py-3 sm:py-4 bg-black/40 backdrop-blur-2xl border-t border-white/[0.08] z-20">
            <div className="max-w-4xl mx-auto space-y-2">
              {/* Linha de Tempo / Scrubber */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-text-muted w-10 text-right tabular-nums">
                  {formatSecondsToTime(currentTime)}
                </span>
                <div
                  onClick={handleTimelineClick}
                  className="flex-1 relative h-4 flex items-center cursor-pointer group"
                >
                  <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden group-hover:h-2 transition-all">
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: accentHex,
                        boxShadow: `0 0 10px ${accentHex}`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progressPercent}
                    onChange={handleSeekChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[11px] font-mono text-text-muted w-10 tabular-nums">
                  {formatSecondsToTime(validDuration)}
                </span>
              </div>

              {/* Botões Centrais de Controle */}
              <div className="flex items-center justify-between pt-1">
                {/* Botão de Curtir / Metadados */}
                <div className="flex items-center gap-2 w-1/4">
                  <button
                    onClick={() => toggleLike(currentTrack.id)}
                    className={`p-2 rounded-full transition-all ${
                      isCurrentLiked
                        ? 'text-rose-500 bg-rose-500/10'
                        : 'text-text-muted hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isCurrentLiked ? 'fill-current' : ''}`} />
                  </button>
                  <span className="hidden sm:inline text-[11px] font-mono text-text-muted">
                    {currentTrack.genre || 'MooSic Hi-Fi'}
                  </span>
                </div>

                {/* Controles Principais */}
                <div className="flex items-center gap-4 sm:gap-6 justify-center">
                  <button
                    onClick={toggleShuffle}
                    className={`p-2 rounded-full transition-all ${
                      isShuffle ? 'text-brand-light bg-brand-purple/20' : 'text-text-muted hover:text-white'
                    }`}
                    title={isShuffle ? 'Desativar modo aleatório' : 'Ativar modo aleatório'}
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={previous}
                    className="p-2.5 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    title="Faixa Anterior"
                  >
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white text-black shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    style={{
                      boxShadow: `0 0 25px rgba(${r}, ${g}, ${b}, 0.6)`,
                    }}
                    title={isPlaying ? 'Pausar' : 'Reproduzir'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current text-black" />
                    ) : (
                      <Play className="w-6 h-6 fill-current text-black ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={next}
                    className="p-2.5 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    title="Próxima Faixa"
                  >
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={toggleRepeat}
                    className={`p-2 rounded-full transition-all ${
                      repeatMode !== 'off'
                        ? 'text-brand-light bg-brand-purple/20'
                        : 'text-text-muted hover:text-white'
                    }`}
                    title={`Repetição: ${repeatMode}`}
                  >
                    {repeatMode === 'one' ? (
                      <Repeat1 className="w-4 h-4" />
                    ) : (
                      <Repeat className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Controle de Volume */}
                <div className="flex items-center justify-end gap-2 w-1/4">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-text-muted hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume * 100}
                    onChange={handleVolumeChange}
                    className="hidden sm:inline-block w-20 h-1 rounded-full accent-brand-purple bg-white/20 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

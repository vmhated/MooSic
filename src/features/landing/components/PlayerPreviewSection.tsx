import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  Sliders,
} from 'lucide-react';
import { Track } from '@/types/domain/music';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { formatSecondsToTime } from '@/providers/lyrics/lrclibLyricsProvider';

interface PlayerPreviewSectionProps {
  currentTrack: Track;
}

export const PlayerPreviewSection: React.FC<PlayerPreviewSectionProps> = ({ currentTrack }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const totalSeconds = currentTrack.durationSeconds || 210;
  const currentSeconds = Math.min(totalSeconds, Math.floor((totalSeconds * progress) / 100));
  const formattedCurrentTime = formatSecondsToTime(currentSeconds);
  const formattedTotalTime = currentTrack.durationFormatted || formatSecondsToTime(totalSeconds);

  // Avança o progresso e o relógio suavemente quando em reprodução
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section
      id="player"
      className="relative py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Section Marker */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-black text-brand-purple">04</span>
        <span className="h-[1px] w-6 bg-brand-purple" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-light bg-white/[0.05] px-3 py-1 rounded-full border border-white/10">
          Experiência Sonora
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans text-white tracking-tight uppercase leading-[0.98]">
          Esculpido para a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-light to-brand-purple drop-shadow-md">
            pureza do áudio.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-text-secondary font-sans max-w-md leading-relaxed">
          Sem perdas, sem compressão destrutiva e sem ruídos visuais. Áudio de estúdio de 24 bits, fila dinâmica e resposta tátil imediata.
        </p>
      </div>

      {/* EXPANSIVE EDITORIAL PLAYER INTERFACE COM GLASSMORPHISM */}
      <motion.div
        className="max-w-5xl mx-auto rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.15)] p-6 sm:p-10 space-y-8 relative overflow-hidden"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top Header of the Player */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl overflow-hidden border border-white/15 shrink-0 shadow-2xl bg-surface group">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover object-center aspect-square"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85';
                }}
              />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans truncate">
                  {currentTrack.title}
                </h3>
                {currentTrack.badge && (
                  <Badge variant="brand" size="sm">
                    {currentTrack.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary font-sans truncate font-medium">
                {currentTrack.artistName} • <span className="text-text-muted">{currentTrack.albumTitle || 'Single'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className={`p-3 rounded-2xl border transition-all duration-300 active:scale-95 backdrop-blur-xl ${
                isLiked
                  ? 'bg-brand-purple/25 border-brand-purple/60 text-brand-light shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                  : 'bg-white/[0.04] border-white/10 text-text-muted hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              aria-label="Fila de reprodução"
              className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-text-secondary hover:text-white hover:bg-white/[0.08] backdrop-blur-xl transition-all duration-200 active:scale-95"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Progress Bar with Accurate Dynamic Timestamps (mm:ss) */}
        <div className="space-y-2 pt-2">
          <Slider value={progress} onChange={setProgress} />
          <div className="flex justify-between text-xs font-mono text-text-muted">
            <span className="text-white font-bold">{formattedCurrentTime}</span>
            <span className="font-semibold">{formattedTotalTime}</span>
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          {/* Audio Engine Meta */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-text-muted font-medium">
            <Sliders className="w-3.5 h-3.5 text-brand-purple" />
            <span>Áudio Hi-Res 24-Bit / 96kHz Lossless</span>
          </div>

          {/* Main Playback Control Buttons Glassmorphic */}
          <div className="flex items-center gap-5 sm:gap-6">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              aria-label="Ordem aleatória"
              className={`p-2 transition-colors duration-200 ${
                isShuffle ? 'text-brand-purple' : 'text-text-muted hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setProgress((p) => Math.max(0, p - 10))}
              aria-label="Faixa anterior"
              className="p-2 text-text-secondary hover:text-white transition-colors duration-200 active:scale-95"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pausar reprodução' : 'Iniciar reprodução'}
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-brand-purple via-violet-600 to-indigo-600 hover:from-brand-hover hover:to-indigo-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.55)] border border-white/30 backdrop-blur-xl transition-all duration-200 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setProgress((p) => Math.min(100, p + 10))}
              aria-label="Próxima faixa"
              className="p-2 text-text-secondary hover:text-white transition-colors duration-200 active:scale-95"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsRepeat(!isRepeat)}
              aria-label="Repetir faixa"
              className={`p-2 transition-colors duration-200 ${
                isRepeat ? 'text-brand-purple' : 'text-text-muted hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-full sm:w-40">
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label="Alternar mudo"
              className="text-text-muted hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <Slider
              value={isMuted ? 0 : volume}
              onChange={(val) => {
                setVolume(val);
                if (isMuted) setIsMuted(false);
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

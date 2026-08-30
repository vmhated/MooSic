import React, { useState } from 'react';
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

interface PlayerPreviewSectionProps {
  currentTrack: Track;
}

export const PlayerPreviewSection: React.FC<PlayerPreviewSectionProps> = ({ currentTrack }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [progress, setProgress] = useState(42);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  return (
    <section
      id="player"
      className="relative py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Section Marker */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-bold text-brand-purple">04</span>
        <span className="h-[1px] w-6 bg-brand-purple" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Listening Experience
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans text-white tracking-tight uppercase leading-[0.98]">
          Crafted for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-primary to-brand-purple">
            pure sound.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-text-secondary font-sans max-w-md">
          A interface de reprodução que elimina ruídos visuais. Áudio sem perdas de 24 bits, fila dinâmica e resposta tátil imediata.
        </p>
      </div>

      {/* EXPANSIVE EDITORIAL PLAYER INTERFACE */}
      <motion.div
        className="max-w-5xl mx-auto rounded-3xl bg-surface-elevated/85 border border-surface-border backdrop-blur-xl shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9)`,
        }}
      >
        {/* Top Header of the Player */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-surface-border/60">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-surface-border shrink-0 shadow-xl group">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-sans truncate">
                  {currentTrack.title}
                </h3>
                {currentTrack.badge && (
                  <Badge variant="brand" size="sm">
                    {currentTrack.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary font-sans">
                {currentTrack.artistName} • <span className="text-text-muted">{currentTrack.albumTitle || 'Single'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className={`p-3 rounded-2xl border transition-all duration-200 active:scale-95 ${
                isLiked
                  ? 'bg-brand-purple/20 border-brand-purple/60 text-brand-purple'
                  : 'bg-surface border-surface-border text-text-muted hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              aria-label="Fila de reprodução"
              className="p-3 rounded-2xl bg-surface border border-surface-border text-text-secondary hover:text-white transition-colors duration-200 active:scale-95"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Progress Bar with Timestamps */}
        <div className="space-y-2 pt-2">
          <Slider value={progress} onChange={setProgress} />
          <div className="flex justify-between text-xs font-sans text-text-muted">
            <span>1:36</span>
            <span>{currentTrack.durationFormatted || '3:45'}</span>
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          {/* Audio Engine Meta */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-text-muted">
            <Sliders className="w-3.5 h-3.5 text-brand-purple" />
            <span>Áudio Hi-Res 24-Bit / 96kHz</span>
          </div>

          {/* Main Playback Control Buttons */}
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
              aria-label="Faixa anterior"
              className="p-2 text-text-secondary hover:text-white transition-colors duration-200 active:scale-95"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pausar reprodução' : 'Iniciar reprodução'}
              className="w-16 h-16 rounded-2xl bg-brand-purple hover:bg-brand-hover text-white flex items-center justify-center shadow-glow hover:shadow-glow-lg transition-all duration-200 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-0.5" />
              )}
            </button>

            <button
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

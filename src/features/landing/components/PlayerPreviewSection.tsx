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
  Sparkles,
} from 'lucide-react';
import { MockTrack } from '../data/mockMusicData';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';

interface PlayerPreviewSectionProps {
  currentTrack: MockTrack;
}

export const PlayerPreviewSection: React.FC<PlayerPreviewSectionProps> = ({ currentTrack }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [progress, setProgress] = useState(38);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Background Subtle Backlight */}
      <motion.div
        className="absolute inset-0 max-w-3xl mx-auto rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${currentTrack.accent} 0%, transparent 70%)`,
        }}
      />

      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-elevated border border-surface-border text-xs font-semibold text-brand-light">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
          <span>PLAYER PREVIEW</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white tracking-tight">
          A interface de reprodução MooSic
        </h2>
        <p className="text-sm sm:text-base text-text-secondary font-sans">
          Projetada para dar destaque ao que realmente importa: a arte, o som e o controle direto da sua experiência.
        </p>
      </div>

      {/* Modern MooSic Player Card */}
      <motion.div
        className="max-w-4xl mx-auto rounded-3xl bg-surface/90 border border-surface-border/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px -10px rgba(${currentTrack.accentRgb}, 0.25)`,
        }}
      >
        {/* Top Player Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-surface-border/60">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-surface-border shrink-0 shadow-lg group">
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans truncate">
                  {currentTrack.title}
                </h3>
                {currentTrack.badge && (
                  <Badge variant="brand" size="sm">
                    {currentTrack.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary font-sans">
                {currentTrack.artist} • <span className="text-text-muted">{currentTrack.album}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className={`p-2.5 rounded-full border transition-all ${
                isLiked
                  ? 'bg-brand-purple/20 border-brand-purple/50 text-brand-purple'
                  : 'bg-surface-elevated border-surface-border text-text-muted hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              aria-label="Fila de reprodução"
              className="p-2.5 rounded-full bg-surface-elevated border border-surface-border text-text-secondary hover:text-white transition-colors"
            >
              <ListMusic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Progress Bar with Timestamps */}
        <div className="space-y-2 pt-2">
          <Slider value={progress} onChange={setProgress} />
          <div className="flex justify-between text-xs font-mono text-text-muted">
            <span>1:24</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Bottom Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          {/* Audio Engine Meta */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
            <Sliders className="w-3.5 h-3.5 text-brand-purple" />
            <span>MooSic HD DAC • 96kHz / 24bit</span>
          </div>

          {/* Main Playback Control Buttons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              aria-label="Shuffle"
              className={`p-2 rounded-lg transition-colors ${
                isShuffle ? 'text-brand-purple' : 'text-text-muted hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              aria-label="Voltar música"
              className="p-2 rounded-full text-text-secondary hover:text-white transition-colors active:scale-95"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
              className="w-14 h-14 rounded-full bg-brand-purple hover:bg-brand-hover text-white flex items-center justify-center shadow-glow transition-all active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <button
              aria-label="Avançar música"
              className="p-2 rounded-full text-text-secondary hover:text-white transition-colors active:scale-95"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRepeat(!isRepeat)}
              aria-label="Repetir"
              className={`p-2 rounded-lg transition-colors ${
                isRepeat ? 'text-brand-purple' : 'text-text-muted hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-full sm:w-36">
            <button
              onClick={() => setIsMuted(!isMuted)}
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

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track } from '@/types/domain/music';
import { PlaybackState, RepeatMode, PlaybackContext } from '@/types/domain/player';
import { youtubeAudioEngine } from '@/services/audio/youtubeAudioEngine';
import { audioResolverService } from '@/services/audio/audioResolverService';
import { playerProgressStore } from '@/stores/playerProgressStore';
import { listeningEventTracker } from '@/services/session/listeningEventTracker';
import { logger } from '@/utils/logger';

export interface PlayerContextType {
  currentTrack: Track | null;
  playbackState: PlaybackState;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  likedTrackIds: string[];
  playbackContext: PlaybackContext | null;

  // Propriedades compatíveis com leitura sob demanda (não disparam re-render global por tick)
  currentTime: number;
  duration: number;

  // Actions
  play: (track?: Track, context?: PlaybackContext) => Promise<void>;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  addToQueue: (track: Track) => void;
  setQueue: (tracks: Track[], startIndex?: number, context?: PlaybackContext) => void;
  setPlaybackContext: (context: PlaybackContext | null) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const LIKED_STORAGE_KEY = 'moosic_liked_tracks';

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [playbackContext, setPlaybackContextState] = useState<PlaybackContext | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('moosic_volume');
    return saved ? Number(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueueState] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeEngineRef = useRef<'youtube' | 'html5'>('youtube');

  // Guardião de transação contra Race Condition na troca rápida A -> B -> C
  const playTransactionRef = useRef<number>(0);

  // Rastreamento para eventos comportamentais
  const currentTrackRef = useRef<Track | null>(null);
  const playbackContextRef = useRef<PlaybackContext | null>(null);
  const queueIndexRef = useRef<number>(-1);
  const trackPlayStartTimeRef = useRef<number>(0);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
    playbackContextRef.current = playbackContext;
    queueIndexRef.current = queueIndex;
  }, [currentTrack, playbackContext, queueIndex]);

  // Inicializa o fallback HTMLAudioElement
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (activeEngineRef.current === 'html5' && !isNaN(audio.currentTime)) {
        playerProgressStore.setProgress(audio.currentTime, audio.duration || 30);
      }
    };

    const handleDurationChange = () => {
      if (activeEngineRef.current === 'html5' && audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        playerProgressStore.setProgress(audio.currentTime || 0, audio.duration);
      }
    };

    const handlePlaying = () => {
      if (activeEngineRef.current === 'html5') {
        setPlaybackState('playing');
      }
    };

    const handlePause = () => {
      if (activeEngineRef.current === 'html5') {
        setPlaybackState('paused');
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Sincroniza volume e mute em ambos os motores
  useEffect(() => {
    youtubeAudioEngine.setVolume(isMuted ? 0 : volume * 100);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('moosic_volume', String(volume));
  }, [volume, isMuted]);

  // Persiste likes
  useEffect(() => {
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedTrackIds));
  }, [likedTrackIds]);

  // Declaração adiada de next para evitar dependência circular nos callbacks
  const nextRef = useRef<() => void>(() => {});

  // Registra os callbacks de tempo e estado no motor invisível do YouTube
  useEffect(() => {
    youtubeAudioEngine.subscribe({
      onStateChange: (state) => {
        if (activeEngineRef.current !== 'youtube') return;
        if (state === 'playing') {
          setPlaybackState('playing');
        } else if (state === 'paused') {
          setPlaybackState('paused');
        } else if (state === 'buffering') {
          setPlaybackState('loading');
        }
      },
      onDurationChange: (dur) => {
        if (activeEngineRef.current !== 'youtube') return;
        if (dur > 0 && isFinite(dur)) {
          playerProgressStore.setProgress(playerProgressStore.getSnapshot().currentTime, dur);
        }
      },
      onTimeUpdate: (cur, dur) => {
        if (activeEngineRef.current !== 'youtube') return;
        // Atualiza a store dedicada de progresso (useSyncExternalStore), SEM disparar re-render no PlayerContext!
        playerProgressStore.setProgress(cur, dur);
      },
      onEnded: () => {
        if (activeEngineRef.current === 'youtube') {
          // Registra conclusão
          if (currentTrackRef.current) {
            listeningEventTracker.recordTrackTransition(
              currentTrackRef.current,
              playerProgressStore.getSnapshot().duration,
              playerProgressStore.getSnapshot().duration,
              playbackContextRef.current,
              queueIndexRef.current
            );
          }
          nextRef.current();
        }
      },
      onError: () => {
        // Fallback resiliente: se o vídeo do YouTube tiver restrição de embed, toca o áudio nativo
        if (currentTrack?.audioUrl && audioRef.current) {
          activeEngineRef.current = 'html5';
          audioRef.current.src = currentTrack.audioUrl;
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      },
    });
  }, [currentTrack]);

  const play = useCallback(async (track?: Track, context?: PlaybackContext) => {
    const audio = audioRef.current;

    if (track) {
      // 1. Incrementa token de transação contra Race Condition
      const transactionId = ++playTransactionRef.current;

      // 2. Se havia uma faixa anterior tocando, registra o evento de transição/skip
      if (currentTrackRef.current && trackPlayStartTimeRef.current > 0) {
        const elapsed = (Date.now() - trackPlayStartTimeRef.current) / 1000;
        listeningEventTracker.recordTrackTransition(
          currentTrackRef.current,
          elapsed,
          playerProgressStore.getSnapshot().duration,
          playbackContextRef.current,
          queueIndexRef.current
        );
      }

      // 3. Atualiza referências para a nova faixa
      trackPlayStartTimeRef.current = Date.now();
      setCurrentTrack(track);
      if (context) {
        setPlaybackContextState(context);
      }
      setPlaybackState('loading');
      playerProgressStore.setProgress(0, track.durationSeconds || 30);

      // 4. Registra início do evento de escuta
      listeningEventTracker.recordTrackStart(
        track,
        context || playbackContextRef.current,
        queueIndexRef.current
      );

      // Interrompe qualquer áudio em reprodução anterior
      if (audio) {
        audio.pause();
      }
      youtubeAudioEngine.pause();

      // Resolve a correspondência da música completa no YouTube
      const result = await audioResolverService.resolveTrackAudio(track);

      // CANCELLATION GUARD: Se o usuário clicou em outra faixa enquanto resolvia, descarta esta resposta!
      if (playTransactionRef.current !== transactionId) {
        logger.info(
          `[PlayerContext] Transação assíncrona descartada para "${track.title}" (ID ${transactionId} vs atual ${playTransactionRef.current})`
        );
        return;
      }

      if (result.videoId) {
        activeEngineRef.current = 'youtube';
        playerProgressStore.setProgress(0, track.durationSeconds || 180);
        youtubeAudioEngine.setVolume(isMuted ? 0 : volume * 100);
        youtubeAudioEngine.loadVideo(result.videoId, true);
      } else if (track.audioUrl && audio) {
        // Fallback: Preview nativo do Deezer / iTunes
        activeEngineRef.current = 'html5';
        audio.src = track.audioUrl;
        audio.currentTime = 0;
        try {
          await audio.play();
          setPlaybackState('playing');
          playerProgressStore.setProgress(0, audio.duration && isFinite(audio.duration) ? audio.duration : 30);
        } catch {
          setPlaybackState('playing');
          playerProgressStore.setProgress(0, track.durationSeconds || 30);
        }
      } else {
        playerProgressStore.setProgress(0, track.durationSeconds || 180);
        setPlaybackState('playing');
      }
    } else if (currentTrack) {
      if (activeEngineRef.current === 'youtube') {
        youtubeAudioEngine.play();
      } else if (audio && currentTrack.audioUrl) {
        await audio.play().catch(() => {});
      }
      setPlaybackState('playing');
    }
  }, [currentTrack, isMuted, volume]);

  const pause = useCallback(() => {
    if (activeEngineRef.current === 'youtube') {
      youtubeAudioEngine.pause();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlaybackState('paused');
  }, []);

  const resume = useCallback(() => {
    if (activeEngineRef.current === 'youtube') {
      youtubeAudioEngine.play();
    } else if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.play().catch(() => {});
    }
    setPlaybackState('playing');
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    if (playbackState === 'playing') {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  }, [playbackState, currentTrack, pause, resume]);

  const next = useCallback(() => {
    if (queue.length === 0) return;

    if (repeatMode === 'one' && currentTrack) {
      if (activeEngineRef.current === 'youtube') {
        youtubeAudioEngine.seekTo(0);
        youtubeAudioEngine.play();
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      playerProgressStore.setProgress(0, playerProgressStore.getSnapshot().duration);
      return;
    }

    let nextIndex = queueIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        pause();
        return;
      }
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      setQueueIndex(nextIndex);
      play(nextTrack, playbackContextRef.current || undefined);
    }
  }, [queue, queueIndex, repeatMode, isShuffle, currentTrack, pause, play]);

  // Mantém nextRef sincronizado
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  // Listener de término de áudio nativo para disparar next() quando estiver em fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (activeEngineRef.current === 'html5') {
        if (currentTrackRef.current) {
          listeningEventTracker.recordTrackTransition(
            currentTrackRef.current,
            playerProgressStore.getSnapshot().duration,
            playerProgressStore.getSnapshot().duration,
            playbackContextRef.current,
            queueIndexRef.current
          );
        }
        next();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [next]);

  const seek = useCallback((seconds: number) => {
    const dur = playerProgressStore.getSnapshot().duration || 30;
    const clamped = Math.max(0, Math.min(seconds, dur));
    if (activeEngineRef.current === 'youtube') {
      youtubeAudioEngine.seekTo(clamped);
    } else if (audioRef.current && isFinite(clamped)) {
      try {
        audioRef.current.currentTime = clamped;
      } catch {}
    }
    playerProgressStore.setProgress(clamped, dur);
  }, []);

  const previous = useCallback(() => {
    const currentProgressTime = playerProgressStore.getSnapshot().currentTime;
    if (currentProgressTime > 3) {
      seek(0);
      return;
    }

    if (queue.length === 0) return;
    const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      setQueueIndex(prevIndex);
      play(prevTrack, playbackContextRef.current || undefined);
    }
  }, [queue, queueIndex, play, seek]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTrackIds((prev) => {
      const isLikedNow = !prev.includes(trackId);
      listeningEventTracker.recordLike(trackId, isLikedNow, playbackContextRef.current);
      return isLikedNow ? [...prev, trackId] : prev.filter((id) => id !== trackId);
    });
  }, []);

  const isLiked = useCallback(
    (trackId: string) => likedTrackIds.includes(trackId),
    [likedTrackIds]
  );

  const addToQueue = useCallback((track: Track) => {
    setQueueState((prev) => [...prev, track]);
  }, []);

  const setQueue = useCallback(
    (tracks: Track[], startIndex = 0, context?: PlaybackContext) => {
      setQueueState(tracks);
      if (context) {
        setPlaybackContextState(context);
      }
      const index = Math.max(0, Math.min(tracks.length - 1, startIndex));
      setQueueIndex(index);
      if (tracks[index]) {
        play(tracks[index], context);
      }
    },
    [play]
  );

  const setPlaybackContext = useCallback((context: PlaybackContext | null) => {
    setPlaybackContextState(context);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        playbackState,
        isPlaying: playbackState === 'playing',
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        likedTrackIds,
        playbackContext,
        get currentTime() {
          return playerProgressStore.getSnapshot().currentTime;
        },
        get duration() {
          return playerProgressStore.getSnapshot().duration;
        },
        play,
        pause,
        resume,
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
        addToQueue,
        setQueue,
        setPlaybackContext,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

// Re-exporta usePlayerProgress para consumo seletivo em componentes de progresso
export { usePlayerProgress } from '@/stores/playerProgressStore';

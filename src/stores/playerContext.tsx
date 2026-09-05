import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Track } from '@/types/domain/music';
import { PlaybackState, RepeatMode } from '@/types/domain/player';
import { youtubeAudioEngine } from '@/services/audio/youtubeAudioEngine';
import { audioResolverService } from '@/services/audio/audioResolverService';

export interface PlayerContextType {
  currentTrack: Track | null;
  playbackState: PlaybackState;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  likedTrackIds: string[];

  // Actions
  play: (track?: Track) => Promise<void>;
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
  setQueue: (tracks: Track[], startIndex?: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const LIKED_STORAGE_KEY = 'moosic_liked_tracks';

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
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

  // Inicializa o fallback HTMLAudioElement
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (activeEngineRef.current === 'html5' && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (activeEngineRef.current === 'html5' && audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
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
          setDuration(dur);
        }
      },
      onTimeUpdate: (cur, dur) => {
        if (activeEngineRef.current !== 'youtube') return;
        if (!isNaN(cur)) {
          setCurrentTime(cur);
        }
        if (dur > 0 && isFinite(dur)) {
          setDuration(dur);
        }
      },
      onEnded: () => {
        if (activeEngineRef.current === 'youtube') {
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

  const play = useCallback(async (track?: Track) => {
    const audio = audioRef.current;

    if (track) {
      setCurrentTrack(track);
      setCurrentTime(0);
      setPlaybackState('loading');

      // Interrompe qualquer áudio em reprodução anterior
      if (audio) {
        audio.pause();
      }
      youtubeAudioEngine.pause();

      // Resolve a correspondência da música completa no YouTube
      const result = await audioResolverService.resolveTrackAudio(track);

      if (result.videoId) {
        activeEngineRef.current = 'youtube';
        setDuration(track.durationSeconds || 180);
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
          setDuration(audio.duration && isFinite(audio.duration) ? audio.duration : 30);
        } catch {
          setPlaybackState('playing');
          setDuration(track.durationSeconds || 30);
        }
      } else {
        setDuration(track.durationSeconds || 180);
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
      setCurrentTime(0);
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
      play(nextTrack);
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
        next();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [next]);

  // Ticker de suporte para fallback HTML5
  useEffect(() => {
    if (playbackState !== 'playing' || activeEngineRef.current === 'youtube') return;

    const timer = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !audio.paused && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
        if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [playbackState]);

  const seek = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration || 30));
    if (activeEngineRef.current === 'youtube') {
      youtubeAudioEngine.seekTo(clamped);
    } else if (audioRef.current && isFinite(clamped)) {
      try {
        audioRef.current.currentTime = clamped;
      } catch {}
    }
    setCurrentTime(clamped);
  }, [duration]);

  const previous = useCallback(() => {
    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (queue.length === 0) return;
    const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      setQueueIndex(prevIndex);
      play(prevTrack);
    }
  }, [currentTime, queue, queueIndex, play]);

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
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  }, []);

  const isLiked = useCallback(
    (trackId: string) => likedTrackIds.includes(trackId),
    [likedTrackIds]
  );

  const addToQueue = useCallback((track: Track) => {
    setQueueState((prev) => [...prev, track]);
  }, []);

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setQueueState(tracks);
    const index = Math.max(0, Math.min(tracks.length - 1, startIndex));
    setQueueIndex(index);
    if (tracks[index]) {
      play(tracks[index]);
    }
  }, [play]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        playbackState,
        isPlaying: playbackState === 'playing',
        currentTime,
        duration: duration > 0 ? duration : (currentTrack?.durationSeconds || 30),
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        likedTrackIds,
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

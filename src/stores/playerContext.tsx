import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Track } from '@/types/domain/music';
import { PlaybackState, RepeatMode, PlaybackContext } from '@/types/domain/player';
import { FlowTrack } from '@/types/domain/flow';
import { youtubeAudioEngine } from '@/services/audio/youtubeAudioEngine';
import { audioResolverService } from '@/services/audio/audioResolverService';
import { playerProgressStore } from '@/stores/playerProgressStore';
import { listeningEventTracker } from '@/services/session/listeningEventTracker';
import { moosicFlowService } from '@/services/flow/moosicFlowService';
import { logger } from '@/utils/logger';

export interface PlayerContextType {
  currentTrack: Track | null;
  playbackState: PlaybackState;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  likedTrackIds: string[];
  playbackContext: PlaybackContext | null;

  // Fila Estruturada do MooSic Flow
  manualQueue: Track[];
  flowQueue: FlowTrack[];
  queueHistory: Track[];
  flowSeed: Track | null;
  isFlowGenerating: boolean;

  // Propriedades de compatibilidade
  queue: Track[];
  queueIndex: number;
  currentTime: number;
  duration: number;

  // Ações de Reprodução
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

  // Ações de Fila Manual & Flow
  playNext: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number, queueType?: 'manual' | 'flow') => void;
  reorderManualQueue: (sourceIndex: number, targetIndex: number) => void;
  promoteFlowToManual: (flowIndex: number) => void;
  clearManualQueue: () => void;
  regenerateFlow: () => Promise<void>;
  setQueue: (tracks: Track[], startIndex?: number, context?: PlaybackContext) => void;
  setPlaybackContext: (context: PlaybackContext | null) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const LIKED_STORAGE_KEY = 'moosic_liked_tracks';
const REFILL_THRESHOLD = 5;

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
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estrutura de Filas do MooSic Flow
  const [manualQueue, setManualQueue] = useState<Track[]>([]);
  const [flowQueue, setFlowQueue] = useState<FlowTrack[]>([]);
  const [queueHistory, setQueueHistory] = useState<Track[]>([]);
  const [flowSeed, setFlowSeed] = useState<Track | null>(null);
  const [isFlowGenerating, setIsFlowGenerating] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeEngineRef = useRef<'youtube' | 'html5'>('youtube');

  // Guardião de transação contra Race Condition em trocas rápidas
  const playTransactionRef = useRef<number>(0);
  const flowGenerationTokenRef = useRef<number>(0);

  // Rastreamento para eventos e callbacks
  const currentTrackRef = useRef<Track | null>(null);
  const playbackContextRef = useRef<PlaybackContext | null>(null);
  const manualQueueRef = useRef<Track[]>([]);
  const flowQueueRef = useRef<FlowTrack[]>([]);
  const queueHistoryRef = useRef<Track[]>([]);
  const flowSeedRef = useRef<Track | null>(null);
  const isGeneratingFlowRef = useRef<boolean>(false);
  const trackPlayStartTimeRef = useRef<number>(0);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
    playbackContextRef.current = playbackContext;
    manualQueueRef.current = manualQueue;
    flowQueueRef.current = flowQueue;
    queueHistoryRef.current = queueHistory;
    flowSeedRef.current = flowSeed;
    isGeneratingFlowRef.current = isFlowGenerating;
  }, [currentTrack, playbackContext, manualQueue, flowQueue, queueHistory, flowSeed, isFlowGenerating]);

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

  // Função central de geração/reabastecimento do MooSic Flow
  const triggerFlowGeneration = useCallback(
    async (seed: Track, current: Track | null, isRefill = false) => {
      const generationToken = ++flowGenerationTokenRef.current;
      setIsFlowGenerating(true);

      try {
        const recentTrackIds = queueHistoryRef.current.slice(-15).map((t) => t.id);
        const recentArtistNames = queueHistoryRef.current.slice(-10).map((t) => t.artistName);
        const excludeTrackIds = [
          ...manualQueueRef.current.map((t) => t.id),
          ...flowQueueRef.current.map((t) => t.id),
        ];

        const generated = await moosicFlowService.generateFlow({
          seedTrack: seed,
          currentTrack: current,
          recentTrackIds,
          recentArtistNames,
          excludeTrackIds,
          limit: isRefill ? 8 : 12,
        });

        // CANCELLATION GUARD: Descarte se um novo comando de geração ocorreu enquanto aguardava resposta
        if (flowGenerationTokenRef.current !== generationToken) {
          return;
        }

        if (isRefill) {
          setFlowQueue((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const newUnique = generated.filter((t) => !existingIds.has(t.id));
            return [...prev, ...newUnique];
          });
        } else {
          setFlowQueue(generated);
        }
      } catch (err) {
        logger.warn('[PlayerContext] Falha ao gerar MooSic Flow:', err);
      } finally {
        if (flowGenerationTokenRef.current === generationToken) {
          setIsFlowGenerating(false);
        }
      }
    },
    []
  );

  // Execução de Play
  const play = useCallback(
    async (track?: Track, context?: PlaybackContext) => {
      const audio = audioRef.current;

      if (track) {
        // 1. Incrementa token de transação contra Race Condition
        const transactionId = ++playTransactionRef.current;

        // 2. Se havia uma faixa anterior tocando, registra transição
        if (currentTrackRef.current && trackPlayStartTimeRef.current > 0) {
          const elapsed = (Date.now() - trackPlayStartTimeRef.current) / 1000;
          listeningEventTracker.recordTrackTransition(
            currentTrackRef.current,
            elapsed,
            playerProgressStore.getSnapshot().duration,
            playbackContextRef.current,
            0
          );
        }

        // 3. Atualiza referências para a nova faixa
        trackPlayStartTimeRef.current = Date.now();
        setCurrentTrack(track);

        if (context) {
          setPlaybackContextState(context);
        }

        // Se o contexto for uma nova seleção manual direta ou se a seed for nula, define nova seed
        if (!flowSeedRef.current || context?.type !== 'flow') {
          setFlowSeed(track);
          triggerFlowGeneration(track, track, false);
        } else {
          // Se já está no flow e o flowQueue estiver baixo, aciona refill
          if (flowQueueRef.current.length < REFILL_THRESHOLD) {
            triggerFlowGeneration(flowSeedRef.current || track, track, true);
          }
        }

        setPlaybackState('loading');
        playerProgressStore.setProgress(0, track.durationSeconds || 30);

        // 4. Registra início do evento de escuta
        listeningEventTracker.recordTrackStart(track, context || playbackContextRef.current, 0);

        // Interrompe áudios anteriores
        if (audio) {
          audio.pause();
        }
        youtubeAudioEngine.pause();

        // Resolve correspondência no YouTube
        const result = await audioResolverService.resolveTrackAudio(track);

        // CANCELLATION GUARD: Descarte se outra faixa foi solicitada durante a resolução
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
          // Fallback nativo
          activeEngineRef.current = 'html5';
          audio.src = track.audioUrl;
          audio.currentTime = 0;
          try {
            await audio.play();
            setPlaybackState('playing');
            playerProgressStore.setProgress(
              0,
              audio.duration && isFinite(audio.duration) ? audio.duration : 30
            );
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
    },
    [currentTrack, isMuted, volume, triggerFlowGeneration]
  );

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

  // Transição central e soberana para a próxima música
  const next = useCallback(() => {
    // 1. Repeat One
    if (repeatMode === 'one' && currentTrackRef.current) {
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

    // 2. Registra histórico da faixa encerrada
    if (currentTrackRef.current) {
      setQueueHistory((prev) => [...prev.slice(-29), currentTrackRef.current!]);
    }

    // 3. Prioridade 1: Fila Manual do Usuário
    if (manualQueueRef.current.length > 0) {
      const [nextManualTrack, ...remainingManual] = manualQueueRef.current;
      setManualQueue(remainingManual);
      play(nextManualTrack, playbackContextRef.current || undefined);

      // Reabastece o Flow em background se estiver baixo
      if (flowQueueRef.current.length < REFILL_THRESHOLD && flowSeedRef.current) {
        triggerFlowGeneration(flowSeedRef.current, nextManualTrack, true);
      }
      return;
    }

    // 4. Prioridade 2: MooSic Flow
    if (flowQueueRef.current.length > 0) {
      const [nextFlowTrack, ...remainingFlow] = flowQueueRef.current;
      setFlowQueue(remainingFlow);
      play(nextFlowTrack, { type: 'flow', title: 'MooSic Flow' });

      // Reabastece o Flow em background se estiver baixo
      if (remainingFlow.length < REFILL_THRESHOLD && flowSeedRef.current) {
        triggerFlowGeneration(flowSeedRef.current, nextFlowTrack, true);
      }
      return;
    }

    // 5. Prioridade 3: Repeat All (se a fila esgotou mas repeat 'all' está ativo)
    if (repeatMode === 'all' && queueHistoryRef.current.length > 0) {
      const firstHistoryTrack = queueHistoryRef.current[0];
      play(firstHistoryTrack, playbackContextRef.current || undefined);
      return;
    }

    // 6. Se esgotou tudo, tenta gerar novo Flow com a faixa atual como semente
    if (currentTrackRef.current) {
      triggerFlowGeneration(currentTrackRef.current, currentTrackRef.current, false);
    } else {
      pause();
    }
  }, [repeatMode, play, pause, triggerFlowGeneration]);

  // Declaração adiada de next para listeners de áudio
  const nextRef = useRef<() => void>(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  // Registra os callbacks no YouTube Engine
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
        playerProgressStore.setProgress(cur, dur);
      },
      onEnded: () => {
        if (activeEngineRef.current === 'youtube') {
          if (currentTrackRef.current) {
            listeningEventTracker.recordTrackTransition(
              currentTrackRef.current,
              playerProgressStore.getSnapshot().duration,
              playerProgressStore.getSnapshot().duration,
              playbackContextRef.current,
              0
            );
          }
          nextRef.current();
        }
      },
      onError: () => {
        if (currentTrack?.audioUrl && audioRef.current) {
          activeEngineRef.current = 'html5';
          audioRef.current.src = currentTrack.audioUrl;
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      },
    });
  }, [currentTrack]);

  // Listener de término do fallback HTML5
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
            0
          );
        }
        nextRef.current();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

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

    if (queueHistory.length > 0) {
      const prevTrack = queueHistory[queueHistory.length - 1];
      setQueueHistory((prev) => prev.slice(0, -1));

      // Se havia uma faixa atual, insere de volta no topo da fila manual
      if (currentTrack) {
        setManualQueue((prev) => [currentTrack, ...prev]);
      }

      play(prevTrack, playbackContextRef.current || undefined);
    } else {
      seek(0);
    }
  }, [queueHistory, currentTrack, play, seek]);

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

  // ================= AÇÕES DA FILA MANUAL & FLOW =================

  // Tocar em seguida (adiciona no topo da fila manual)
  const playNext = useCallback((track: Track) => {
    setManualQueue((prev) => [track, ...prev.filter((t) => t.id !== track.id)]);
    logger.info(`[Queue] Play Next: "${track.title}" adicionada no topo da fila manual.`);
  }, []);

  // Adicionar à fila (adiciona no fim da fila manual)
  const addToQueue = useCallback((track: Track) => {
    setManualQueue((prev) => [...prev.filter((t) => t.id !== track.id), track]);
    logger.info(`[Queue] Add To Queue: "${track.title}" adicionada ao fim da fila manual.`);
  }, []);

  // Remover da fila
  const removeFromQueue = useCallback((index: number, queueType: 'manual' | 'flow' = 'manual') => {
    if (queueType === 'manual') {
      setManualQueue((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFlowQueue((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  // Reordenar fila manual
  const reorderManualQueue = useCallback((sourceIndex: number, targetIndex: number) => {
    setManualQueue((prev) => {
      const nextArr = [...prev];
      const [removed] = nextArr.splice(sourceIndex, 1);
      nextArr.splice(targetIndex, 0, removed);
      return nextArr;
    });
  }, []);

  // Promover faixa do Flow para a Fila Manual
  const promoteFlowToManual = useCallback((flowIndex: number) => {
    setFlowQueue((prev) => {
      const track = prev[flowIndex];
      if (track) {
        setManualQueue((mPrev) => [...mPrev, track]);
        return prev.filter((_, i) => i !== flowIndex);
      }
      return prev;
    });
  }, []);

  // Limpar fila manual
  const clearManualQueue = useCallback(() => {
    setManualQueue([]);
  }, []);

  // Regenerar Flow com a faixa atual / semente
  const regenerateFlow = useCallback(async () => {
    if (currentTrack || flowSeed) {
      await triggerFlowGeneration(currentTrack || flowSeed!, currentTrack, false);
    }
  }, [currentTrack, flowSeed, triggerFlowGeneration]);

  // SetQueue com suporte retroativo: faixa inicial toca, restantes vão para a fila manual
  const setQueue = useCallback(
    (tracks: Track[], startIndex = 0, context?: PlaybackContext) => {
      if (tracks.length === 0) return;

      const safeIndex = Math.max(0, Math.min(tracks.length - 1, startIndex));
      const chosenTrack = tracks[safeIndex];
      const remainingTracks = tracks.slice(safeIndex + 1);

      setManualQueue(remainingTracks);
      setFlowSeed(chosenTrack);

      if (context) {
        setPlaybackContextState(context);
      }

      play(chosenTrack, context);
      triggerFlowGeneration(chosenTrack, chosenTrack, false);
    },
    [play, triggerFlowGeneration]
  );

  const setPlaybackContext = useCallback((context: PlaybackContext | null) => {
    setPlaybackContextState(context);
  }, []);

  // Fila combinada para compatibilidade de visualização
  const effectiveQueue = useMemo<Track[]>(() => {
    const list: Track[] = [];
    if (currentTrack) list.push(currentTrack);
    list.push(...manualQueue);
    list.push(...flowQueue);
    return list;
  }, [currentTrack, manualQueue, flowQueue]);

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
        likedTrackIds,
        playbackContext,

        // MooSic Flow State
        manualQueue,
        flowQueue,
        queueHistory,
        flowSeed,
        isFlowGenerating,

        // Retrocompatibilidade
        queue: effectiveQueue,
        queueIndex: 0,
        get currentTime() {
          return playerProgressStore.getSnapshot().currentTime;
        },
        get duration() {
          return playerProgressStore.getSnapshot().duration;
        },

        // Ações
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

        // Ações de Fila
        playNext,
        addToQueue,
        removeFromQueue,
        reorderManualQueue,
        promoteFlowToManual,
        clearManualQueue,
        regenerateFlow,
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

export { usePlayerProgress } from '@/stores/playerProgressStore';

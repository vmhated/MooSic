import { initialPlayerState } from '@/stores/playerStore';

/**
 * Hook de abstração para acesso ao Player Global Persistente.
 * As telas e componentes consumirão este hook para controlar reprodução.
 */
export function usePlayer() {
  return {
    ...initialPlayerState,
    play: async () => {},
    pause: () => {},
    resume: () => {},
    next: () => {},
    previous: () => {},
    seek: () => {},
    setVolume: () => {},
    toggleMute: () => {},
    toggleShuffle: () => {},
    setRepeatMode: () => {},
    addToQueue: () => {},
    removeFromQueue: () => {},
    clearQueue: () => {},
  };
}

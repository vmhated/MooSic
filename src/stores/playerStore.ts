import { PlayerState, PlayerActions } from '@/types/domain/player';

/**
 * Interface do Contrato do Store Global do Player.
 * Prepara a arquitetura para gerenciador de estado (Zustand, React Context ou Redux)
 * sem vincular a UI a uma implementação rígida prematura.
 */
export interface IPlayerStore extends PlayerState, PlayerActions {}

export const initialPlayerState: PlayerState = {
  currentTrack: null,
  playbackState: 'idle',
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off',
  queue: [],
  queueIndex: -1,
  context: null,
  errorMessage: null,
};

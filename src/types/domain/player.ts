import { Track } from './music';
import { FlowTrack } from './flow';

export type RepeatMode = 'off' | 'all' | 'one';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export type PlaybackContextType =
  | 'home'
  | 'search'
  | 'playlist'
  | 'library'
  | 'album'
  | 'artist'
  | 'discovery'
  | 'recommendation'
  | 'queue'
  | 'flow'
  | 'favorites';

export interface PlaybackContext {
  type: PlaybackContextType;
  id?: string;
  title?: string;
  position?: number;
  metadata?: Record<string, unknown>;
}

export interface PlayerState {
  currentTrack: Track | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  context: PlaybackContext | null;
  errorMessage: string | null;

  // MooSic Flow & Estrutura de Fila
  manualQueue: Track[];
  flowQueue: FlowTrack[];
  queueHistory: Track[];
  flowSeed: Track | null;
  isFlowGenerating: boolean;
}

export interface PlayerActions {
  play: (track?: Track, context?: PlaybackContext) => Promise<void>;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  
  // Ações de Fila Manual & Flow
  playNext: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number, queueType?: 'manual' | 'flow') => void;
  reorderManualQueue: (sourceIndex: number, targetIndex: number) => void;
  promoteFlowToManual: (flowIndex: number) => void;
  clearManualQueue: () => void;
  regenerateFlow: () => Promise<void>;
  clearQueue: () => void;
}

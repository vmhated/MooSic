import { Track } from './music';

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
}

export interface PlayerActions {
  play: (track?: Track) => Promise<void>;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

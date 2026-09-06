import { PlaybackContext } from './player';

export type ListeningEventType =
  | 'track_start'
  | 'track_skip'
  | 'track_complete'
  | 'track_pause'
  | 'track_resume'
  | 'track_like'
  | 'track_add_playlist';

export interface ListeningEvent {
  id: string;
  eventType: ListeningEventType;
  trackId: string;
  trackTitle?: string;
  artistName?: string;
  artistId?: string;
  trackCoverUrl?: string;
  timestamp: number;
  durationPlayedSeconds: number;
  totalDurationSeconds: number;
  completionRatio: number; // 0.0 a 1.0
  skipped: boolean;
  skipOffsetSeconds?: number;
  playbackContext: PlaybackContext | null;
  queuePosition?: number;
  device?: string;
}

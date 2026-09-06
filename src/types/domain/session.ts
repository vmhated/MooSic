import { ListeningEvent } from './event';
import { Track } from './music';
import { PlaybackContext } from './player';

export type SessionPhaseType = 'intro' | 'build' | 'peak' | 'cruise' | 'wind_down';

export interface SessionNarrativePhase {
  timeFormatted: string;
  phase: SessionPhaseType;
  label: string; // Ex: "🌙 Chill Noturno", "🔥 Pico de Energia", "🎯 Cadência de Foco"
  dominantGenre: string;
  averageEnergy: number; // 0 a 100
}

export interface SessionStory {
  title: string;
  narrative: string; // Ex: "23:15 (Chill) → 23:45 (Pico de Energia 84%) → 00:20 (Atmosférico). 45 min de imersão."
  insight: string; // Ex: "Você manteve alto foco com 85% de retenção e apenas 1 skip."
  dominantVibe: string; // Ex: "Noturno & Foco", "Energia Urbana", "Descoberta Curiosa"
  phases: SessionNarrativePhase[];
}

export interface SessionTrackSummary {
  trackId: string;
  title: string;
  artist: string;
  coverUrl?: string;
  durationSeconds: number;
  durationPlayedSeconds: number;
  completed: boolean;
  skipped: boolean;
  playedAt: number;
}

export interface ListeningSession {
  id: string;
  startedAt: number;
  endedAt: number;
  totalDurationSeconds: number;
  trackCount: number;
  completedTrackCount: number;
  skippedTrackCount: number;
  averageEnergy: number;
  peakEnergyTimestamp?: number;
  dominantGenres: string[];
  topArtists: string[];
  events: ListeningEvent[];
  story?: SessionStory;
  tracks: SessionTrackSummary[];
}

export interface HistoryItem {
  id: string;
  track: Track;
  playedAt: number;
  durationPlayedSeconds: number;
  completed: boolean;
  skipped: boolean;
  playbackContext: PlaybackContext | null;
  sessionId?: string;
}

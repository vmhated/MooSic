import { Track } from './music';

export type PlaylistThemeId =
  | 'cyberpunk-neon'
  | 'sunset-gold'
  | 'midnight-velvet'
  | 'emerald-focus'
  | 'solar-flare'
  | 'cosmic-blue';

export interface PlaylistTheme {
  id: PlaylistThemeId;
  name: string;
  gradient: string;
  accent: string;
  bgGlow: string;
  iconName: 'Flame' | 'Radio' | 'Zap' | 'Compass' | 'Sparkles' | 'Disc';
}

export interface CustomPlaylist {
  id: string;
  title: string;
  description: string;
  themeId: PlaylistThemeId;
  createdAt: number;
  tracks: Track[];
  isPinned?: boolean;
}

export interface ResonatorPreset {
  id: '432hz' | '528hz' | 'alpha10hz' | 'brown-noise';
  name: string;
  tag: string;
  frequency: number; // Hz
  description: string;
  color: string;
  bgGlow: string;
}

export interface AudioMetrics {
  energy: number; // 0 a 100
  danceability: number; // 0 a 100
  atmosphere: number; // 0 a 100
  acousticness: number; // 0 a 100
  instrumentalness: number; // 0 a 100
  valenceMood: number; // 0 a 100
  tempoBpm: number; // Batimentos por minuto
  key?: string;
}

export interface PlaylistDNA {
  playlistId: string;
  archetypeTitle: string; // Ex: "Explosão Noturna", "Cadência Urbana"
  archetypeDescription: string;
  energy: number; // 0 a 100
  danceability: number; // 0 a 100
  atmosphere: number; // 0 a 100
  moodValence: number; // 0 a 100
  acousticness: number; // 0 a 100
  vocalsRatio: number; // 0 a 100
  tempoAvg: number; // BPM médio
  artistDiversityRatio: number; // 0.0 a 1.0
  genreDiversityRatio: number; // 0.0 a 1.0
  uniqueArtistCount: number;
  totalTracks: number;
  isAnalyzed: boolean;
}


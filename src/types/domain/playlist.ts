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

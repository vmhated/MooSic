import { Track } from './music';

/**
 * Razões explicáveis para uma recomendação do MooSic Flow
 */
export type FlowRecommendationReason =
  | 'same_artist'
  | 'related_artist'
  | 'same_genre'
  | 'discovery'
  | 'seed_affinity';

/**
 * Faixa enriquecida gerada pelo MooSic Flow
 */
export interface FlowTrack extends Track {
  flowReason?: FlowRecommendationReason;
  flowScore?: number;
  flowSeedId?: string;
  flowSeedTitle?: string;
  flowSeedArtist?: string;
}

/**
 * Contexto fornecido para o motor de recomendação gerar candidatos
 */
export interface RecommendationContext {
  seedTrack: Track;
  currentTrack?: Track | null;
  recentTrackIds: string[];
  recentArtistNames: string[];
  excludeTrackIds: string[];
  limit?: number;
}

/**
 * Estado estruturado da fila de reprodução
 */
export interface FlowQueueState {
  manualQueue: Track[];
  flowQueue: FlowTrack[];
  queueHistory: Track[];
  flowSeed: Track | null;
}

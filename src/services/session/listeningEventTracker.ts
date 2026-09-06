import { ListeningEvent, ListeningEventType } from '@/types/domain/event';
import { Track } from '@/types/domain/music';
import { PlaybackContext } from '@/types/domain/player';
import { logger } from '@/utils/logger';

export const SKIP_THRESHOLD_SECONDS = 25;
export const COMPLETION_RATIO_THRESHOLD = 0.85;
const STORAGE_KEY = 'moosic_listening_events_v1';
const MAX_STORED_EVENTS = 200;

class ListeningEventTrackerService {
  private events: ListeningEvent[] = [];
  private listeners: Set<(event: ListeningEvent) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.events = parsed;
        }
      }
    } catch (err) {
      logger.warn('[ListeningEventTracker] Falha ao carregar eventos do storage:', err);
      this.events = [];
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      // Mantém buffer circular dos últimos MAX_STORED_EVENTS para não estourar cota de armazenamento
      if (this.events.length > MAX_STORED_EVENTS) {
        this.events = this.events.slice(-MAX_STORED_EVENTS);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
    } catch (err) {
      logger.warn('[ListeningEventTracker] Falha ao persistir eventos:', err);
    }
  }

  private emit(event: ListeningEvent) {
    this.events.push(event);
    this.persist();
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        logger.error('[ListeningEventTracker] Erro no listener de evento:', err);
      }
    });
  }

  public subscribe(listener: (event: ListeningEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getRecentEvents(limit = 50): ListeningEvent[] {
    return [...this.events].reverse().slice(0, limit);
  }

  public clearEvents() {
    this.events = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Registra o início de reprodução de uma faixa
   */
  public recordTrackStart(
    track: Track,
    context: PlaybackContext | null = null,
    queuePosition = 0
  ): ListeningEvent {
    const event: ListeningEvent = {
      id: `evt-start-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventType: 'track_start',
      trackId: track.id,
      trackTitle: track.title,
      artistName: track.artistName,
      artistId: track.artistId,
      trackCoverUrl: track.coverUrl,
      timestamp: Date.now(),
      durationPlayedSeconds: 0,
      totalDurationSeconds: track.durationSeconds || 30,
      completionRatio: 0,
      skipped: false,
      playbackContext: context,
      queuePosition,
      device: typeof navigator !== 'undefined' ? navigator.userAgent : 'desktop',
    };

    this.emit(event);
    logger.info(`[ListeningEventTracker] track_start: "${track.title}" (${track.artistName})`);
    return event;
  }

  /**
   * Registra a transição ou encerramento da faixa anterior avaliando regras de Skip e Completion
   */
  public recordTrackTransition(
    track: Track,
    durationPlayedSeconds: number,
    totalDurationSeconds: number,
    context: PlaybackContext | null = null,
    queuePosition = 0
  ): ListeningEvent {
    const validTotal = Math.max(totalDurationSeconds, 1);
    const clampedPlayed = Math.max(0, Math.min(durationPlayedSeconds, validTotal));
    const completionRatio = Math.min(1, clampedPlayed / validTotal);

    // Heurística comportamental:
    // Skip: se a faixa foi trocada antes de 25 segundos
    const skipped = clampedPlayed < SKIP_THRESHOLD_SECONDS;
    // Conclusão: se ouviu mais de 85% da duração
    const completed = completionRatio >= COMPLETION_RATIO_THRESHOLD;

    let eventType: ListeningEventType = 'track_pause';
    if (completed) {
      eventType = 'track_complete';
    } else if (skipped) {
      eventType = 'track_skip';
    }

    const event: ListeningEvent = {
      id: `evt-${eventType}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventType,
      trackId: track.id,
      trackTitle: track.title,
      artistName: track.artistName,
      timestamp: Date.now(),
      durationPlayedSeconds: Math.round(clampedPlayed),
      totalDurationSeconds: Math.round(validTotal),
      completionRatio: Number(completionRatio.toFixed(2)),
      skipped,
      skipOffsetSeconds: skipped ? Math.round(clampedPlayed) : undefined,
      playbackContext: context,
      queuePosition,
    };

    this.emit(event);
    logger.info(
      `[ListeningEventTracker] ${eventType}: "${track.title}" (${Math.round(clampedPlayed)}s / ${Math.round(validTotal)}s, ${(completionRatio * 100).toFixed(0)}%)`
    );
    return event;
  }

  /**
   * Registra evento de curtir/descurtir
   */
  public recordLike(trackId: string, isLiked: boolean, context: PlaybackContext | null = null) {
    const event: ListeningEvent = {
      id: `evt-like-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventType: 'track_like',
      trackId,
      timestamp: Date.now(),
      durationPlayedSeconds: 0,
      totalDurationSeconds: 0,
      completionRatio: 0,
      skipped: false,
      playbackContext: context,
      device: isLiked ? 'liked' : 'unliked',
    };
    this.emit(event);
  }

  /**
   * Registra evento de adição à playlist
   */
  public recordAddToPlaylist(
    trackId: string,
    playlistId: string,
    context: PlaybackContext | null = null
  ) {
    const event: ListeningEvent = {
      id: `evt-add-pl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventType: 'track_add_playlist',
      trackId,
      timestamp: Date.now(),
      durationPlayedSeconds: 0,
      totalDurationSeconds: 0,
      completionRatio: 0,
      skipped: false,
      playbackContext: context,
      device: playlistId,
    };
    this.emit(event);
  }
}

export const listeningEventTracker = new ListeningEventTrackerService();

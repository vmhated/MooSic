import { ListeningEvent } from '@/types/domain/event';
import {
  ListeningSession,
  SessionStory,
  SessionNarrativePhase,
  SessionTrackSummary,
  HistoryItem,
} from '@/types/domain/session';
import { listeningEventTracker } from '@/services/session/listeningEventTracker';
import { logger } from '@/utils/logger';

const SESSIONS_STORAGE_KEY = 'moosic_listening_sessions_v1';
const ACTIVE_SESSION_STORAGE_KEY = 'moosic_active_session_v1';
const HISTORY_STORAGE_KEY = 'moosic_listening_history_v1';

const SESSION_INACTIVITY_THRESHOLD_MS = 20 * 60 * 1000; // 20 minutos sem eventos = nova sessão
const MAX_STORED_SESSIONS = 30;
const MAX_STORED_HISTORY = 100;

class SessionService {
  private activeSession: ListeningSession | null = null;
  private sessions: ListeningSession[] = [];
  private history: HistoryItem[] = [];
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;
    this.loadFromStorage();

    // Assina o fluxo de eventos discretos emitidos pelo Player
    listeningEventTracker.subscribe((event) => {
      this.handleListeningEvent(event);
    });
  }

  private loadFromStorage() {
    try {
      const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (storedSessions) {
        this.sessions = JSON.parse(storedSessions);
      }

      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        this.history = JSON.parse(storedHistory);
      }

      const storedActive = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (storedActive) {
        const parsedActive: ListeningSession = JSON.parse(storedActive);
        // Se a sessão ativa salva ficou inativa por mais do que o limite, consolida-a imediatamente
        if (Date.now() - parsedActive.endedAt > SESSION_INACTIVITY_THRESHOLD_MS) {
          this.consolidateSession(parsedActive);
          this.activeSession = null;
          localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
        } else {
          this.activeSession = parsedActive;
        }
      }
    } catch (err) {
      logger.warn('[SessionService] Falha ao ler sessões do storage:', err);
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      if (this.sessions.length > MAX_STORED_SESSIONS) {
        this.sessions = this.sessions.slice(-MAX_STORED_SESSIONS);
      }
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(this.sessions));

      if (this.history.length > MAX_STORED_HISTORY) {
        this.history = this.history.slice(0, MAX_STORED_HISTORY);
      }
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));

      if (this.activeSession) {
        localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(this.activeSession));
      } else {
        localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      }
    } catch (err) {
      logger.warn('[SessionService] Falha ao persistir sessões:', err);
    }
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        logger.error('[SessionService] Erro no listener:', err);
      }
    });
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  /**
   * Processa cada evento discreto que chega do player
   */
  private handleListeningEvent(event: ListeningEvent) {
    const now = Date.now();

    // 1. Checa se precisamos consolidar a sessão ativa por tempo de inatividade
    if (this.activeSession) {
      const elapsed = now - this.activeSession.endedAt;
      if (elapsed > SESSION_INACTIVITY_THRESHOLD_MS) {
        this.consolidateSession(this.activeSession);
        this.activeSession = null;
      }
    }

    // 2. Cria nova sessão ativa se não houver
    if (!this.activeSession) {
      this.activeSession = {
        id: `sess-${now}-${Math.random().toString(36).substring(2, 7)}`,
        startedAt: now,
        endedAt: now,
        totalDurationSeconds: 0,
        trackCount: 0,
        completedTrackCount: 0,
        skippedTrackCount: 0,
        averageEnergy: 65,
        dominantGenres: [],
        topArtists: [],
        events: [],
        tracks: [],
      };
    }

    // 3. Adiciona o evento à sessão
    this.activeSession.endedAt = now;
    this.activeSession.events.push(event);

    // 4. Se for início de faixa
    if (event.eventType === 'track_start') {
      this.handleTrackStart(event);
    } else if (event.eventType === 'track_complete' || event.eventType === 'track_skip') {
      this.handleTrackEnd(event);
    }

    this.persist();
    this.notify();
  }

  private handleTrackStart(event: ListeningEvent) {
    if (!this.activeSession) return;

    // Registra faixa na sessão se ainda não estiver
    const existingIndex = this.activeSession.tracks.findIndex((t) => t.trackId === event.trackId);
    if (existingIndex === -1) {
      const summary: SessionTrackSummary = {
        trackId: event.trackId,
        title: event.trackTitle || 'Faixa sem título',
        artist: event.artistName || 'Artista desconhecido',
        coverUrl: event.trackCoverUrl,
        durationSeconds: event.totalDurationSeconds || 30,
        durationPlayedSeconds: 0,
        completed: false,
        skipped: false,
        playedAt: event.timestamp,
      };
      this.activeSession.tracks.push(summary);
      this.activeSession.trackCount = this.activeSession.tracks.length;

      // Atualiza topArtists
      if (event.artistName && !this.activeSession.topArtists.includes(event.artistName)) {
        this.activeSession.topArtists.push(event.artistName);
      }
    }

    // Adiciona ao Histórico de Reprodução
    const historyItem: HistoryItem = {
      id: `hist-${event.timestamp}-${event.trackId}`,
      track: {
        id: event.trackId,
        title: event.trackTitle || 'Faixa sem título',
        artistId: event.artistId || 'artist-unknown',
        artistName: event.artistName || 'Artista desconhecido',
        coverUrl: event.trackCoverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
        durationSeconds: event.totalDurationSeconds || 30,
        genre: event.playbackContext?.title || 'Geral',
        isExplicit: false,
        providerId: 'moosic',
        providerTrackId: event.trackId,
      },
      playedAt: event.timestamp,
      durationPlayedSeconds: 0,
      completed: false,
      skipped: false,
      playbackContext: event.playbackContext,
      sessionId: this.activeSession.id,
    };

    // Insere no início do histórico (cronológico reverso)
    this.history.unshift(historyItem);
  }

  private handleTrackEnd(event: ListeningEvent) {
    if (!this.activeSession) return;

    const isComplete = event.eventType === 'track_complete';
    const isSkip = event.eventType === 'track_skip';

    // Atualiza resumo da faixa na sessão
    const trackItem = this.activeSession.tracks.find((t) => t.trackId === event.trackId);
    if (trackItem) {
      trackItem.durationPlayedSeconds = event.durationPlayedSeconds;
      trackItem.completed = isComplete;
      trackItem.skipped = isSkip;
    }

    if (isComplete) {
      this.activeSession.completedTrackCount++;
    } else if (isSkip) {
      this.activeSession.skippedTrackCount++;
    }

    this.activeSession.totalDurationSeconds += event.durationPlayedSeconds;

    // Atualiza histórico correspondente
    const hist = this.history.find((h) => h.track.id === event.trackId);
    if (hist) {
      hist.durationPlayedSeconds = event.durationPlayedSeconds;
      hist.completed = isComplete;
      hist.skipped = isSkip;
    }
  }

  /**
   * Consolida uma sessão finalizada, gerando sua narrativa poética/analítica
   */
  private consolidateSession(session: ListeningSession) {
    // Apenas consolida se tiver ao menos 1 faixa ou tempo significativo
    if (session.tracks.length === 0 && session.totalDurationSeconds < 10) {
      return;
    }

    session.story = this.synthesizeStory(session);
    this.sessions.unshift(session);
    logger.info(`[SessionService] Sessão consolidada: ${session.story.title} (${session.tracks.length} faixas)`);
  }

  /**
   * Sintetizador determinístico de Narrativa de Sessão ("Session Story")
   * De acordo com as especificações do MOOSIC_PRODUCT_SPEC.md
   */
  public synthesizeStory(session: ListeningSession): SessionStory {
    const startDate = new Date(session.startedAt);
    const hour = startDate.getHours();
    const durationMin = Math.max(1, Math.round(session.totalDurationSeconds / 60));

    // Determina o arquétipo de horário
    let timeOfDay = 'Noturno';
    let dominantVibe = 'Noturno & Imersão';
    let baseEmoji = '🌙';

    if (hour >= 5 && hour < 12) {
      timeOfDay = 'Matinal';
      dominantVibe = 'Despertar & Cadência';
      baseEmoji = '☀️';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'da Tarde';
      dominantVibe = 'Foco & Ritmo Urbano';
      baseEmoji = '⚡';
    } else if (hour >= 18 && hour < 22) {
      timeOfDay = 'Crepúsculo';
      dominantVibe = 'Descompressão & Vibe';
      baseEmoji = '🌆';
    }

    // Avalia retenção e engajamento
    const totalTracks = Math.max(1, session.tracks.length);
    const completedRatio = session.completedTrackCount / totalTracks;
    const skippedRatio = session.skippedTrackCount / totalTracks;

    let insight = '';
    if (session.skippedTrackCount === 0 && session.completedTrackCount > 0) {
      insight = `Você manteve imersão contínua em 100% das faixas, sem nenhum skip.`;
    } else if (completedRatio >= 0.7) {
      insight = `Alta retenção sonora com ${(completedRatio * 100).toFixed(0)}% das faixas ouvidas até o fim.`;
    } else if (skippedRatio >= 0.5) {
      insight = `Sessão de busca ativa: você explorou faixas com troca ágil procurando a sintonia ideal.`;
    } else {
      insight = `Equilíbrio sonoro com cadência estável ao longo de ${durationMin} min.`;
    }

    // Gênero / Contexto predominante
    const artistSummary = session.topArtists.slice(0, 2).join(' e ') || 'Vários Artistas';
    const title = `Sessão ${timeOfDay} com ${artistSummary}`;

    // Constrói fases da narrativa (Intro -> Peak -> Cruise / Wind Down)
    const phases: SessionNarrativePhase[] = [];
    const formatTime = (ts: number) => {
      const d = new Date(ts);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const startTimeFormatted = formatTime(session.startedAt);
    const endTimeFormatted = formatTime(session.endedAt);

    phases.push({
      timeFormatted: startTimeFormatted,
      phase: 'intro',
      label: `${baseEmoji} Início Suave`,
      dominantGenre: session.dominantGenres[0] || 'Descoberta',
      averageEnergy: 55,
    });

    if (totalTracks >= 2) {
      const midTime = formatTime(Math.round((session.startedAt + session.endedAt) / 2));
      phases.push({
        timeFormatted: midTime,
        phase: 'peak',
        label: `🔥 Pico de Energia (78%)`,
        dominantGenre: session.dominantGenres[0] || 'Fluxo Principal',
        averageEnergy: 78,
      });
    }

    phases.push({
      timeFormatted: endTimeFormatted,
      phase: 'wind_down',
      label: `✨ Descompressão`,
      dominantGenre: session.dominantGenres[0] || 'Encerramento',
      averageEnergy: 45,
    });

    const narrative = `${startTimeFormatted} (${dominantVibe}) → ${endTimeFormatted} (${totalTracks} faixas). ${durationMin} min de fluxo.`;

    return {
      title,
      narrative,
      insight,
      dominantVibe,
      phases,
    };
  }

  // ================= API PÚBLICA =================

  public getActiveSession(): ListeningSession | null {
    return this.activeSession;
  }

  public getRecentSessions(limit = 10): ListeningSession[] {
    return this.sessions.slice(0, limit);
  }

  public getLastCompletedSession(): ListeningSession | null {
    if (this.sessions.length > 0) {
      return this.sessions[0];
    }
    // Se não há sessões fechadas mas há sessão ativa com faixas, podemos gerar uma prévia
    if (this.activeSession && this.activeSession.tracks.length > 0) {
      return {
        ...this.activeSession,
        story: this.synthesizeStory(this.activeSession),
      };
    }
    return null;
  }

  public getHistory(limit = 50): HistoryItem[] {
    return this.history.slice(0, limit);
  }

  public clearHistory() {
    this.history = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
    this.notify();
  }

  public clearAllSessions() {
    this.sessions = [];
    this.activeSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    }
    this.notify();
  }
}

export const sessionService = new SessionService();

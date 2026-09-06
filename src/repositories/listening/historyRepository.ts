import { BaseRepository } from '../baseRepository';

export interface ListeningEvent {
  id: string;
  user_id: string;
  provider: string;
  provider_track_id: string;
  event_type: string;
  timestamp: string;
  duration_played?: number;
  completed: boolean;
  source?: string;
  metadata?: any;
}

export class HistoryRepository extends BaseRepository {
  async logEvent(event: Partial<ListeningEvent> & { provider: string; provider_track_id: string; event_type: string }): Promise<void> {
    const { error } = await this.supabase
      .from('listening_events')
      .insert(event);

    this.handleError(error, 'logEvent');
  }

  async getRecentHistory(limit: number = 50): Promise<ListeningEvent[]> {
    const { data, error } = await this.supabase
      .from('listening_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    this.handleError(error, 'getRecentHistory');
    return data || [];
  }
}

export const historyRepository = new HistoryRepository();

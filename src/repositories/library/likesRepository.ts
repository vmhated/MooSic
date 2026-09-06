import { BaseRepository } from '../baseRepository';

export interface LikedTrack {
  user_id: string;
  provider: string;
  provider_track_id: string;
  created_at: string;
}

export class LikesRepository extends BaseRepository {
  async getUserLikes(): Promise<LikedTrack[]> {
    const { data, error } = await this.supabase
      .from('user_liked_tracks')
      .select('*')
      .order('created_at', { ascending: false });

    this.handleError(error, 'getUserLikes');
    return data || [];
  }

  async likeTrack(provider: string, providerTrackId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_liked_tracks')
      .insert({ provider, provider_track_id: providerTrackId });

    if (error && error.code !== '23505') { // Ignore unique constraint violation
      this.handleError(error, 'likeTrack');
    }
  }

  async unlikeTrack(provider: string, providerTrackId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_liked_tracks')
      .delete()
      .match({ provider, provider_track_id: providerTrackId });

    this.handleError(error, 'unlikeTrack');
  }
}

export const likesRepository = new LikesRepository();

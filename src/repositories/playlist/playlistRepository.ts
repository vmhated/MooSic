import { BaseRepository } from '../baseRepository';

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  provider: string;
  provider_track_id: string;
  position: number;
  added_at: string;
}

export class PlaylistRepository extends BaseRepository {
  async getUserPlaylists(): Promise<Playlist[]> {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });

    this.handleError(error, 'getUserPlaylists');
    return data || [];
  }

  async createPlaylist(playlist: Partial<Playlist> & { name: string }): Promise<Playlist> {
    const { data, error } = await this.supabase
      .from('playlists')
      .insert(playlist)
      .select()
      .single();

    this.handleError(error, 'createPlaylist');
    return data;
  }

  async addTrackToPlaylist(track: Partial<PlaylistTrack> & { playlist_id: string; provider: string; provider_track_id: string; position: number }): Promise<PlaylistTrack> {
    const { data, error } = await this.supabase
      .from('playlist_tracks')
      .insert(track)
      .select()
      .single();

    this.handleError(error, 'addTrackToPlaylist');
    return data;
  }
  
  async getPlaylistTracks(playlistId: string): Promise<PlaylistTrack[]> {
    const { data, error } = await this.supabase
      .from('playlist_tracks')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    this.handleError(error, 'getPlaylistTracks');
    return data || [];
  }
}

export const playlistRepository = new PlaylistRepository();

import { BaseRepository } from '../baseRepository';
import type { Profile } from '@/types/domain/user';

export class ProfileRepository extends BaseRepository {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) this.handleError(error, 'getProfile');
    return data;
  }

  async createProfile(profile: Partial<Profile> & { id: string; username: string }): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    this.handleError(error, 'createProfile');
    return data;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    this.handleError(error, 'updateProfile');
    return data;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error) this.handleError(error, 'checkUsernameExists');
    return !!data;
  }
}

export const profileRepository = new ProfileRepository();

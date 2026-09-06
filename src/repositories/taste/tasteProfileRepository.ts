import { supabase } from '@/lib/supabase';
import { TasteProfile } from '@/types/domain/taste';

/**
 * Repository for taste_profiles table.
 * Handles read and upsert operations for the current authenticated user.
 * RLS guarantees auth.uid() = id — no cross-user access is possible.
 */
export class TasteProfileRepository {
  private readonly tableName = 'taste_profiles';

  async getProfile(): Promise<TasteProfile | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        console.error('[TasteProfileRepository] Error fetching taste profile:', error);
        return null;
      }
      return data as TasteProfile;
    } catch (e) {
      console.error('[TasteProfileRepository] Exception:', e);
      return null;
    }
  }

  async upsertProfile(profile: Partial<TasteProfile>): Promise<TasteProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[TasteProfileRepository] Error upserting:', error);
        return null;
      }
      return data as TasteProfile;
    } catch (e) {
      console.error('[TasteProfileRepository] Exception upserting:', e);
      return null;
    }
  }
}

export const tasteProfileRepository = new TasteProfileRepository();

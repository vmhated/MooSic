import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export class BaseRepository {
  protected supabase = supabase;

  protected handleError(error: PostgrestError | null, context: string): void {
    if (error) {
      console.error(`[Repository Error] ${context}:`, error.message, error.details);
      throw new Error(`[${context}] ${error.message}`);
    }
  }
}

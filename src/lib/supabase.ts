import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Aviso caso as variáveis estejam vazias
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn(
    'MooSic Supabase Client: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Please check your .env.local file.'
  );
}

// Cria uma instância única do Supabase
export const supabase = createClient(
  env.supabaseUrl || 'https://placeholder-project.supabase.co',
  env.supabaseAnonKey || 'placeholder-anon-key'
);

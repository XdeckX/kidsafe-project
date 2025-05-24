import { createClient } from '@supabase/supabase-js';
import { type Database } from '@repo/lib/src/database.types';

// In a real setup, these would be environment variables
// For now, we'll use placeholder values since we're doing frontend-only development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Create a single supabase client for the browser
export const createBrowserSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
};

// For server-side usage
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

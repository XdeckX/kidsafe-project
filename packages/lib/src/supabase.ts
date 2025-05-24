import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Create a singleton Supabase client for use in shared utilities
// Note: In the browser, we'll use the auth-helpers for Next.js instead
export const createSupabaseClient = (
  supabaseUrl: string,
  supabaseKey: string,
  options = {}
) => {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // Don't persist session in server functions
    },
    ...options,
  });
};

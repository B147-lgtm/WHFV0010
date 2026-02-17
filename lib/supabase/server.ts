import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase client for use in server-side contexts.
 * Configured with persistSession: false to ensure sessions do not leak across 
 * different server-side requests in an App Router environment.
 * 
 * Note: For handling authenticated requests with cookies, 
 * consider using the @supabase/ssr package.
 */
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

import { supabase as unifiedSupabase } from '../supabase';

/**
 * Re-exports the unified Supabase client for consistency.
 */
export const createBrowserClient = () => unifiedSupabase;
export const supabase = unifiedSupabase;
import { supabase } from './supabase';

/**
 * Checks if the current session belongs to a user in the admin_users allowlist.
 * @returns {Promise<boolean>} True if authorized admin, false otherwise.
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) return false;

    // Local Mock Bypass
    if (session.user.id === 'mock-uuid') return true;

    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', session.user.email)
      .maybeSingle();

    if (error || !data) {
      if (session && session.user.id !== 'mock-uuid') await supabase.auth.signOut();
      return false;
    }

    return true;
  } catch (err) {
    console.error('Admin Guard Error:', err);
    return false;
  }
};

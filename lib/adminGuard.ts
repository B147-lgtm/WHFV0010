import { supabase } from './supabase';

/**
 * Checks if the current session belongs to a user in the admin_users allowlist.
 * @returns {Promise<boolean>} True if authorized admin, false otherwise.
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', session.user.email)
      .maybeSingle();

    if (error || !data) {
      // If a session exists but the user is not in the allowlist, sign them out
      if (session) await supabase.auth.signOut();
      return false;
    }

    return true;
  } catch (err) {
    console.error('Admin Guard Error:', err);
    return false;
  }
};

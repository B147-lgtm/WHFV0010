import { createClient } from '@supabase/supabase-js';

/**
 * Robust environment variable access.
 * Prevents "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')" 
 * by safely checking for the existence of import.meta.env.
 */
// @ts-ignore
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const isProd = env.PROD === true;
const isDev = env.DEV === true || !isProd;

// Development warning: log if keys are missing in dev mode
if (isDev && (!supabaseUrl || !supabaseKey)) {
  console.warn(
    '[Supabase Warning] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. ' +
    'The application is defaulting to "Local Mock Mode". ' +
    'To use your real backend, please ensure these are defined in your .env or deployment settings.'
  );
}

// Production safeguard: throw error if keys are missing in prod mode
if (isProd && (!supabaseUrl || !supabaseKey)) {
  throw new Error(
    'CRITICAL ERROR: Supabase configuration keys are missing in production. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.'
  );
}

/**
 * Mocking utility for local development when keys are absent.
 */
const createMockBuilder = (data: any = []) => {
  const promise = Promise.resolve({ data, error: null });
  const builder: any = {
    then: (onfulfilled?: any, onrejected?: any) => promise.then(onfulfilled, onrejected),
    catch: (onrejected?: any) => promise.catch(onrejected),
    finally: (onfinally?: any) => promise.finally(onfinally),
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    eq: () => builder,
    match: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => createMockBuilder(Array.isArray(data) ? (data[0] || {}) : data),
    maybeSingle: () => createMockBuilder(Array.isArray(data) ? (data[0] || null) : data),
    data,
    error: null
  };
  return builder;
};

// Export the client: real if keys exist, mock otherwise
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: (table: string) => {
        if (isProd) {
          console.error(`Attempted to access table "${table}" in production without Supabase keys.`);
        }
        return createMockBuilder([]);
      },
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string) => ({ data: { path }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: `https://via.placeholder.com/800x600?text=${path}` } }),
          remove: async () => ({ data: null, error: null })
        })
      },
      auth: {
        signInWithPassword: async ({ email, password }: any) => {
          // Local bypass for development
          if (email === 'admin@woodheaven.com' && password === 'admin123') {
            return { data: { user: { id: 'mock-uuid', email: 'admin@woodheaven.com' } }, error: null };
          }
          return { data: { user: null }, error: new Error('Invalid credentials in Local Mock Mode.') };
        },
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as any;

import { createClient } from '@supabase/supabase-js';

// Safe environment variable detection for Vite
// @ts-ignore
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const isProd = env.PROD === true;
const isDev = env.DEV === true || !isProd;

/**
 * Enhanced mock data for total website control in Local Mode
 */
const DEFAULT_MOCK_DATA: Record<string, any[]> = {
  site_settings: [{
    id: 1,
    brand_name: 'Wood Heaven Farms',
    hero_title: 'Welcome to Heaven',
    hero_subtitle: 'A sanctuary of elegance and luxury.',
    tagline: 'Estd. 2024 • Luxury Farmhouse',
    whatsapp_number: '918852021119',
    phone_number: '+91 88520 21119',
    email_address: 'woodheavenfarms@gmail.com',
    address_text: '631,632, Sikar Road, Jaipur',
    meta_description: 'Jaipurs most exclusive 8-suite luxury farmhouse for stays and events.',
    meta_keywords: 'luxury farmhouse, jaipur stay, wedding venue, private pool farm',
    section2_badge: 'Entire Farm Stay : 5 Star Airbnb guest favourite',
    section2_title: 'Luxury of Tranquility',
    section2_subtitle: 'Immerse yourself in a bespoke sanctuary designed for group stays and high-end retreats. Experience the pinnacle of Jaipur\'s hospitality with 8 private suites, sprawling gardens, and a dedicated on-site team.',
    section2_image_url: 'https://images.unsplash.com/photo-1544161515-4af6b1d8d16e?auto=format&fit=crop&q=80&w=1200'
  }],
  stay_enquiries: [
    { id: '1', name: 'Aman Singh', phone: '9829012345', checkin: '2024-06-15', checkout: '2024-06-18', guests: 12, status: 'new', created_at: new Date().toISOString() },
    { id: '2', name: 'Riya Kapoor', phone: '9828054321', checkin: '2024-07-02', checkout: '2024-07-04', guests: 8, status: 'contacted', created_at: new Date(Date.now() - 86400000).toISOString() }
  ],
  event_enquiries: [
    { id: '1', name: 'Vogue Events', phone: '9001234567', event_date: '2024-08-20', event_type: 'Corporate', guests: 100, status: 'new', created_at: new Date().toISOString() }
  ],
  testimonials: [
    { 
      id: '1', 
      name: "Aditi Sharma", 
      context: "Corporate Retreat", 
      rating: 5, 
      text: "The absolute perfect getaway for our leadership offsite. The peace and tranquility of the property allowed for deep focus.", 
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
    },
    { 
      id: '2', 
      name: "Vikram Mehta", 
      context: "Wedding Celebration", 
      rating: 5, 
      text: "Hosted my sister's mehendi at the Royal Front Lawn. The staff was incredibly attentive, and the lighting was fairytale-like.", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
    },
    { 
      id: '3', 
      name: "Sneha Kapoor", 
      context: "Family Weekend", 
      rating: 5, 
      text: "We booked the entire property for a family reunion. Having 8 suites meant everyone had their own space. Spectacular.", 
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" 
    }
  ],
  faqs: [
    { id: '1', question: "What is the guest capacity?", answer: "Up to 20 adults for stays, 150 for events." }
  ],
  amenity_groups: [
    { id: '1', title: 'Property Access', icon_name: 'Home', items: ['8 Deluxe Suite rooms', '1 Presidential Suite', 'Private washrooms'] },
    { id: '2', title: 'Leisure', icon_name: 'Waves', items: ['Private swimming pool', '4 large open gardens'] }
  ],
  event_spaces: [
    { id: '1', name: 'Royal Front Lawn', capacity: '150 Guests', description: 'Perfect for grand wedding functions.' },
    { id: '2', name: 'Secret Bar Garden', capacity: '80 Guests', description: 'Intimate wooden-themed space.' }
  ],
  house_rules: [
    { id: '1', rule_text: 'Entire property is booked privately.', sort_order: 1 },
    { id: '2', rule_text: 'Loud music not permitted outdoors after 10PM.', sort_order: 2 }
  ],
  admin_users: [{ email: 'admin@woodheaven.com' }]
};

const createMockBuilder = (table: string, data: any = []) => {
  const tableData = data.length > 0 ? data : (DEFAULT_MOCK_DATA[table] || []);
  const promise = Promise.resolve({ data: tableData, error: null });
  
  const builder: any = {
    then: (onfulfilled?: any, onrejected?: any) => promise.then(onfulfilled, onrejected),
    catch: (onrejected?: any) => promise.catch(onrejected),
    finally: (onfinally?: any) => promise.finally(onfinally),
    select: () => builder,
    insert: (payload: any) => {
       console.log(`[Mock Insert] ${table}:`, payload);
       return builder;
    },
    update: (payload: any) => {
       console.log(`[Mock Update] ${table}:`, payload);
       return builder;
    },
    upsert: (payload: any) => {
       console.log(`[Mock Upsert] ${table}:`, payload);
       return builder;
    },
    delete: () => builder,
    eq: () => builder,
    maybeSingle: () => Promise.resolve({ data: tableData[0] || null, error: null }),
    single: () => Promise.resolve({ data: tableData[0] || {}, error: null }),
    order: () => builder,
    limit: () => builder,
  };
  return builder;
};

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: (table: string) => createMockBuilder(table),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string) => ({ data: { path }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: `https://via.placeholder.com/800x600?text=${bucket}/${path}` } }),
        })
      },
      auth: {
        signInWithPassword: async ({ email, password }: any) => {
          if (email === 'admin@woodheaven.com' && password === 'admin123') {
            const user = { id: 'mock-uuid', email: 'admin@woodheaven.com' };
            localStorage.setItem('whf_mock_session', JSON.stringify(user));
            return { data: { user }, error: null };
          }
          return { data: { user: null }, error: new Error('Invalid credentials') };
        },
        signOut: async () => {
          localStorage.removeItem('whf_mock_session');
          return { error: null };
        },
        getSession: async () => {
          const stored = localStorage.getItem('whf_mock_session');
          const user = stored ? JSON.parse(stored) : null;
          return { data: { session: user ? { user } : null }, error: null };
        },
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as any;

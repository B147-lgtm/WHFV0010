import React from 'react';

// REPLACE THESE URLS with your actual file paths or Supabase Storage URLs
export const BRAND_ASSETS = {
  logo: 'logo.png', // Save the provided logo as logo.png in your project root
  heroImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000',
  favicon: 'favicon.ico'
};

export const COLORS = {
  forest: '#1a2e1a', // Deep green matching the logo background
  earth: '#4a3728',
  beige: '#f5f0e6',
  gold: '#c5a059',   // Gold matching the logo's outer ring
  sun: '#facc15',    // Bright yellow matching the logo's sun
};

export const ICONS = {
  Home: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  Pool: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3" strokeWidth="1.2"/></svg>
  ),
  Waves: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 11c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209 1.791 4 4 4s4-1.791 4-4m-16 4c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209 1.791 4 4 4s4-1.791 4-4"/></svg>
  ),
  Kitchen: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
  ),
  Bed: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M3 14h18M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4M8 14v.01M16 14v.01"/></svg>
  ),
  Event: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 9l-3 3-3-3m3 3V3m0 12v3m-4-2l4 4 4-4"/></svg>
  ),
  Safety: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  Tree: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 19V5m-4 6a4 4 0 018 0M5 13a7 7 0 0114 0M3 19h18"/></svg>
  ),
  Car: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M16 7a2 2 0 11-4 0 2 2 0 014 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 11l3 3 3-3"/></svg>
  ),
  Chef: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 17h18c.55 0 1-.45 1-1v-2c0-5.52-4.48-10-10-10S2 8.48 2 14v2c0 .55.45 1 1 1zm9 3v-3"/></svg>
  ),
  ShieldCar: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM7 14l1.5-1.5h7L17 14m-10 0h10v2H7v-2z"/></svg>
  )
};

export const AMENITY_GROUPS = [
  {
    title: 'Property Access',
    icon: ICONS.Home,
    items: [
      'Entire private farmhouse',
      '8 Deluxe Suite rooms (up to 20 adults)',
      '1 Presidential Suite',
      'Attached private washrooms',
      'Spacious living & common areas'
    ]
  },
  {
    title: 'Leisure & Outdoor',
    icon: ICONS.Waves,
    items: [
      'Private swimming pool',
      '4 large open gardens',
      'Dedicated bar / gathering garden',
      'Open lawn space for events',
      'Bonfire setup (on request)'
    ]
  },
  {
    title: 'Kitchen & Dining',
    icon: ICONS.Chef,
    items: [
      'Fully equipped kitchen',
      'Gas stove & utensils (extra cost)',
      'Refrigerator',
      'In-house catering available'
    ]
  },
  {
    title: 'Room Amenities',
    icon: ICONS.Bed,
    items: [
      'Fresh bed linen & towels',
      'Toiletries included',
      'Mini fridge in rooms',
      'Electric kettle with tea/coffee',
      'Open-air shower in select rooms'
    ]
  },
  {
    title: 'Event Support',
    icon: ICONS.Event,
    items: [
      'Space for day events (~150 guests)',
      'Indoor music basement post 10 PM',
      'Mic, speaker & projector',
      'Décor & coordination support'
    ]
  },
  {
    title: 'Safety & Utilities',
    icon: ICONS.Safety,
    items: [
      'Ample private parking',
      'Fully gated property',
      '24/7 water supply & RO water',
      'Caretaker support',
      'Daily housekeeping'
    ]
  }
];

export const AMENITIES = [
  { name: '8 Deluxe Suites', icon: ICONS.Bed },
  { name: 'Private Pool', icon: ICONS.Waves },
  { name: '4 Open Gardens', icon: ICONS.Tree },
  { name: 'In-house Catering', icon: ICONS.Chef },
  { name: 'Event Spaces', icon: ICONS.Event },
  { name: 'Secure Parking', icon: ICONS.ShieldCar },
];

export const TESTIMONIALS = [
  {
    name: "Aditi Sharma",
    context: "Corporate Retreat",
    rating: 5,
    text: "The absolute perfect getaway for our leadership offsite. The peace and tranquility of the property allowed for deep focus, while the pool area was the highlight of our evenings.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Vikram Mehta",
    context: "Wedding Celebration",
    rating: 5,
    text: "Hosted my sister's mehendi at the Royal Front Lawn. The staff was incredibly attentive, and the lighting at night turned the farm into a fairytale. Truly a heaven on earth.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Sneha Kapoor",
    context: "Family Weekend",
    rating: 5,
    text: "We booked the entire property for a family reunion. Having 8 suites meant everyone had their own space, but the large dining hall brought us all together. Simply spectacular.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  }
];

export const GALLERY_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200', category: 'Lawn', title: 'Main Lawn' },
  { id: 2, url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200', category: 'Pool', title: 'Infinity Pool' },
  { id: 3, url: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200', category: 'Rooms', title: 'Master Bedroom' },
  { id: 4, url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=1200', category: 'Bar Garden', title: 'Outdoor Bar' },
  { id: 5, url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200', category: 'Rooms', title: 'Cozy Corner' },
  { id: 6, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200', category: 'Lawn', title: 'Event Space' },
  { id: 7, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', category: 'Pool', title: 'Sunset View' },
  { id: 8, url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200', category: 'Night Vibes', title: 'Firepit Evenings' },
];

export const FAQs = [
  { q: "What is the total guest capacity?", a: "For overnight stays, we comfortably accommodate up to 20 adults across 8 deluxe suites and 1 presidential suite. For events, our multiple lawns can host up to 150 guests." },
  { q: "Do you allow external catering?", a: "We offer in-house catering (extra cost). External caterers are permitted for large events subject to a kitchen facility fee." },
  { q: "What is the check-in/out time?", a: "Standard check-in is at 2:00 PM and check-out is at 11:00 AM. Early check-in is subject to availability." },
  { q: "Is the property private?", a: "Yes, the entire farm, including the pool and all 4 gardens, is exclusively yours during your stay." }
];
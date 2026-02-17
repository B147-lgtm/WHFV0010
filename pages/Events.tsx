import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { EventType } from '../types';

const EVENT_SPACES = [
  { name: 'Royal Front Lawn', capacity: '100-150 Guests', desc: 'Lush green expanse perfect for large wedding functions and grand gatherings.' },
  { name: 'Secret Bar Garden', capacity: '50-80 Guests', desc: 'An intimate, wooden-themed space for cocktail nights and boutique celebrations.' },
  { name: 'Poolside Deck', capacity: 'Upto 40 Guests', desc: 'Tropical vibes for birthdays, sundowners, and relaxed social mixers.' },
];

export const Events: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    event_date: '',
    event_type: EventType.OTHER,
    guests: 20,
    requirements: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }: any) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || 'direct';

    const { error } = await supabase.from('event_enquiries').insert([{
      ...formData,
      source: utm_source,
      status: 'new'
    }]);

    if (!error) {
      setStatus('success');
      const whatsappNum = settings?.whatsapp_number || '918852021119';
      const waMessage = `Hi! Planning an event at Wood Heaven Farms.\nType: ${formData.event_type}\nDate: ${formData.event_date}\nGuests: ${formData.guests}`;
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(waMessage)}`, '_blank');
    }
  };

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="h-[60vh] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">Timeless Celebrations</h1>
          <p className="text-white/80 uppercase tracking-widest text-sm">Where your dreams find a home.</p>
        </div>
      </section>

      <section className="py-32 bg-beige px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <h2 className="text-4xl font-serif text-forest mb-12">Elegant Spaces</h2>
              <div className="space-y-12">
                {EVENT_SPACES.map((space, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-end border-b border-earth/20 pb-4 mb-4">
                      <h3 className="text-2xl font-serif">{space.name}</h3>
                      <span className="text-xs uppercase tracking-widest text-earth/60 font-bold">{space.capacity}</span>
                    </div>
                    <p className="text-earth/60 group-hover:text-earth transition-colors">{space.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 bg-white p-8 rounded-2xl shadow-sm border border-earth/5">
                <p className="text-sm font-bold uppercase tracking-widest mb-4">Full Details</p>
                <button className="bg-earth text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-forest transition-all flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Download Event Brochure
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="bg-forest p-10 md:p-16 rounded-[3rem] shadow-2xl text-white">
              <h2 className="text-4xl font-serif mb-8">Plan Your Event</h2>
              {status === 'success' ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-beige text-forest rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
                  <h3 className="text-2xl mb-4 font-serif">Enquiry Submitted</h3>
                  <p className="text-white/60 mb-8">Our event curator will call you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="text-white underline tracking-widest uppercase text-xs">Send another enquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="text" required placeholder="Name" 
                      className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-beige"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                      type="tel" required placeholder="Phone" 
                      className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-beige"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select 
                      className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-beige"
                      value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value as EventType})}
                    >
                      {Object.values(EventType).map(type => (
                        <option key={type} value={type} className="text-forest">{type}</option>
                      ))}
                    </select>
                    <input 
                      type="date" required 
                      className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-beige"
                      value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})}
                    />
                  </div>
                  <input 
                    type="number" required placeholder="Estimated Guest Count" 
                    className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-beige"
                    value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                  />
                  <textarea 
                    placeholder="Briefly describe your requirements (Catering, Decor, Stage, etc.)" 
                    className="w-full bg-white/10 border-none rounded-xl px-4 py-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-beige h-32"
                    value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})}
                  />
                  <button 
                    disabled={status === 'loading'}
                    className="w-full bg-beige text-forest py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl text-sm"
                  >
                    {status === 'loading' ? 'Submitting...' : 'Enquire Now'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
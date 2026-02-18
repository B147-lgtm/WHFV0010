import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EventType } from '../types';

export const Events: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', event_date: '', event_type: EventType.OTHER, guests: 20, requirements: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [spaces, setSpaces] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => setSettings(data));
    supabase.from('event_spaces').select('*').then(({ data }) => setSpaces(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('event_enquiries').insert([{ ...formData, source: 'direct', status: 'new' }]);
    if (!error) {
      setStatus('success');
      const whatsappNum = settings?.whatsapp_number || '918852021119';
      const waMessage = `Hi! Planning an event at Wood Heaven Farms.\nType: ${formData.event_type}\nDate: ${formData.event_date}\nGuests: ${formData.guests}`;
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(waMessage)}`, '_blank');
    } else setStatus('idle');
  };

  return (
    <div className="pt-24 bg-beige selection:bg-forest selection:text-white">
      <section className="h-[70vh] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-forest/40 z-10 backdrop-blur-[2px]" />
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="relative z-20 text-center px-6">
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-6 drop-shadow-2xl">Grandeur</h1>
          <p className="text-[#c5a059] uppercase tracking-[0.5em] text-[11px] font-black">Refined Celebrations • Timeless Spaces</p>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <h2 className="text-4xl font-serif text-forest mb-16">The Curated Grounds</h2>
              <div className="space-y-16">
                {spaces.map((space, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-end border-b border-earth/10 pb-6 mb-6">
                      <h3 className="text-3xl font-serif text-forest">{space.name}</h3>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-black">{space.capacity}</span>
                    </div>
                    <p className="text-earth/50 text-sm leading-relaxed group-hover:text-forest transition-colors">{space.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-forest p-12 md:p-20 rounded-[4rem] shadow-2xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/5 blur-[80px] rounded-full" />
               <h2 className="text-4xl font-serif mb-10 text-[#c5a059] relative z-10">Event Proposal</h2>
               {status === 'success' ? (
                 <div className="py-16 text-center">
                   <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl">✓</div>
                   <h3 className="text-2xl mb-4 font-serif">Proposal Submitted</h3>
                   <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Our Curator Will Reach Out Shortly</p>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <input required placeholder="Full Name" className="w-full bg-white/5 border-none rounded-3xl px-6 py-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#c5a059]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                     <input required placeholder="Phone" className="w-full bg-white/5 border-none rounded-3xl px-6 py-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#c5a059]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <select className="w-full bg-white/5 border-none rounded-3xl px-6 py-5 text-white focus:ring-2 focus:ring-[#c5a059] text-sm" value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value as EventType})}>
                       {Object.values(EventType).map(type => <option key={type} value={type} className="text-forest">{type}</option>)}
                     </select>
                     <input type="date" required className="w-full bg-white/5 border-none rounded-3xl px-6 py-5 text-white focus:ring-2 focus:ring-[#c5a059]" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} />
                   </div>
                   <textarea placeholder="Event Vision & Special Requirements..." className="w-full bg-white/5 border-none rounded-3xl px-6 py-5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#c5a059] h-32" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} />
                   <button disabled={status === 'loading'} className="w-full bg-white text-forest py-6 rounded-full font-black uppercase tracking-[0.3em] hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl text-[10px]">
                     {status === 'loading' ? 'Processing Proposal...' : 'Submit Proposal'}
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

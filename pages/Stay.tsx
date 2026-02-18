import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ICONS } from '../constants';
import { supabase } from '../lib/supabase';

export const Stay: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', checkin: '', checkout: '', guests: 1, message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [settings, setSettings] = useState<any>(null);
  const [amenityGroups, setAmenityGroups] = useState<any[]>([]);
  const [houseRules, setHouseRules] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => setSettings(data));
    supabase.from('amenity_groups').select('*').then(({ data }) => setAmenityGroups(data || []));
    supabase.from('house_rules').select('*').order('sort_order', { ascending: true }).then(({ data }) => setHouseRules(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('stay_enquiries').insert([{ ...formData, source: 'direct', status: 'new' }]);
    if (!error) {
      setStatus('success');
      const whatsappNum = settings?.whatsapp_number || '918852021119';
      const waMessage = `Hi Wood Heaven Farms! I want to book a stay.\nName: ${formData.name}\nDates: ${formData.checkin} to ${formData.checkout}\nGuests: ${formData.guests}`;
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(waMessage)}`, '_blank');
    } else {
      setStatus('idle');
      alert('Error submitting request.');
    }
  };

  return (
    <div className="pt-24 bg-beige selection:bg-forest selection:text-white">
      <section className="py-24 px-6 bg-forest text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/10 blur-[100px] rounded-full" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-serif mb-8 tracking-tight">The Stay</h1>
          <p className="text-[#c5a059] max-w-2xl mx-auto text-[11px] uppercase tracking-[0.5em] font-black leading-relaxed">Exclusive Luxury Retreat • 8 Suite Sanctuary</p>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <div>
              <h2 className="text-4xl font-serif mb-12 text-forest">Bespoke Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {amenityGroups.map((group, i) => {
                  // @ts-ignore
                  const IconComp = ICONS[group.icon_name] || ICONS.Home;
                  return (
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={i} className="p-10 bg-white rounded-[3.5rem] shadow-xl border border-white/50">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="text-forest bg-beige p-4 rounded-2xl"><IconComp /></div>
                        <h3 className="font-serif text-2xl text-forest">{group.title}</h3>
                      </div>
                      <ul className="space-y-4">
                        {group.items?.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-earth/60 leading-relaxed">
                            <span className="text-[#c5a059] font-black">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl border border-white/50">
              <h2 className="text-3xl font-serif mb-12 text-forest">Sanctuary Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {houseRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="font-black text-forest shrink-0 text-xl">0{idx + 1}.</span>
                    <p className="text-earth/70 text-sm leading-relaxed">{rule.rule_text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-white/50 sticky top-32 h-fit">
            <h3 className="text-3xl font-serif mb-8 text-forest">Reserve Now</h3>
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-forest text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl text-2xl">✓</div>
                <h4 className="text-2xl font-serif mb-4 text-forest">Enquiry Sent</h4>
                <p className="text-earth/40 text-[10px] uppercase font-black tracking-widest mb-8">Directing to WhatsApp Concierge</p>
                <button onClick={() => setStatus('idle')} className="text-[#c5a059] font-black text-[10px] underline uppercase tracking-widest">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input required placeholder="Full Name" className="w-full px-6 py-5 bg-beige/50 border-none rounded-3xl focus:ring-2 focus:ring-forest text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required placeholder="Phone Number" className="w-full px-6 py-5 bg-beige/50 border-none rounded-3xl focus:ring-2 focus:ring-forest text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" required className="w-full px-6 py-5 bg-beige/50 border-none rounded-3xl focus:ring-2 focus:ring-forest text-xs" value={formData.checkin} onChange={e => setFormData({...formData, checkin: e.target.value})} />
                  <input type="date" required className="w-full px-6 py-5 bg-beige/50 border-none rounded-3xl focus:ring-2 focus:ring-forest text-xs" value={formData.checkout} onChange={e => setFormData({...formData, checkout: e.target.value})} />
                </div>
                <button disabled={status === 'loading'} className="w-full bg-forest text-white py-6 rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-[#c5a059] transition-all text-[10px]">
                  {status === 'loading' ? 'Encrypting...' : 'Request Private Access'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

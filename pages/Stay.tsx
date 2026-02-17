import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AMENITY_GROUPS } from '../constants';
import { supabase } from '../lib/supabase';

export const Stay: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    checkin: '',
    checkout: '',
    guests: 1,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Get the most recent site settings
    supabase.from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) setSettings(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || 'direct';

    const { error } = await supabase.from('stay_enquiries').insert([{
      ...formData,
      source: utm_source,
      status: 'new'
    }]);

    if (!error) {
      setStatus('success');
      const whatsappNum = settings?.whatsapp_number || '918852021119';
      const waMessage = `Hi Wood Heaven Farms! I want to book a stay.\nName: ${formData.name}\nDates: ${formData.checkin} to ${formData.checkout}\nGuests: ${formData.guests}`;
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(waMessage)}`, '_blank');
    } else {
      console.error('Submission error:', error);
      setStatus('idle');
      alert('Something went wrong. Please try again.');
    }
  };

  const airbnbUrl = settings?.airbnb_url || 'https://www.airbnb.com/rooms/1149468945691456184'; // Example actual ID or fallback
  const bookingUrl = settings?.booking_url || 'https://www.booking.com/hotel/in/wood-heaven-farms.html';

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20 px-6 bg-earth text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif mb-6">The Stay Experience</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg uppercase tracking-widest">A luxury 8-bedroom sanctuary + Presidential Suite designed for ultimate comfort and privacy.</p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="py-32 bg-beige px-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <div>
              <h2 className="text-4xl font-serif mb-12 border-l-4 border-earth pl-6 text-forest">Unrivaled Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {AMENITY_GROUPS.map((group, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={i} 
                    className="p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-earth bg-beige p-3 rounded-full"><group.icon /></div>
                      <h3 className="font-serif text-xl text-forest">{group.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {group.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-earth/70">
                          <span className="text-[#c5a059] mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white/40 p-8 md:p-12 rounded-[3rem] border border-white">
              <h2 className="text-3xl font-serif mb-10 text-forest text-center md:text-left">House Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-earth/80 text-sm leading-relaxed">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">01.</span>
                    <p>Entire property is booked privately — only registered guests are allowed inside.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">02.</span>
                    <p>Overnight stay is permitted for a maximum of 20 adults only.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">03.</span>
                    <p>Day events with additional guests require prior approval.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">04.</span>
                    <p>Loud music is not permitted in outdoor areas after 10:00 PM. Guests may continue the celebration in the basement area at controlled volume.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">05.</span>
                    <p>All events, décor setups, DJs, or external vendors must be pre-approved.</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">06.</span>
                    <p>Guests are responsible for any damage to rooms, furniture, pool area, lawns, or fixtures.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">07.</span>
                    <p>Garden cleaning post-event must be managed by the event team. If required, we can arrange cleaning at additional cost.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">08.</span>
                    <p>Government-issued ID is mandatory for all adult guests at check-in.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">09.</span>
                    <p>Illegal activities, drugs, or misconduct will lead to immediate cancellation of booking without refund.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-forest shrink-0 text-lg">10.</span>
                    <p>Please respect the property, staff, and surrounding environment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white sticky top-32 h-fit">
            <h3 className="text-2xl font-serif mb-6 text-forest">Check Availability</h3>
            {status === 'success' ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-forest text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">✓</div>
                <h4 className="text-xl font-bold mb-2 text-forest">Request Sent!</h4>
                <p className="text-earth/60 text-sm mb-6">Redirecting you to WhatsApp for instant concierge support...</p>
                <button onClick={() => setStatus('idle')} className="text-[#c5a059] font-bold text-[10px] underline uppercase tracking-widest">Submit Another Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-earth/40 ml-1">Full Name</label>
                  <input 
                    type="text" required placeholder="John Doe" 
                    className="w-full px-5 py-4 bg-beige border-none rounded-2xl focus:ring-2 focus:ring-forest text-sm"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-earth/40 ml-1">Phone Number</label>
                  <input 
                    type="tel" required placeholder="+91 00000 00000" 
                    className="w-full px-5 py-4 bg-beige border-none rounded-2xl focus:ring-2 focus:ring-forest text-sm"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-earth/40 ml-1">Check-in</label>
                    <input 
                      type="date" required 
                      className="w-full px-5 py-4 bg-beige border-none rounded-2xl focus:ring-2 focus:ring-forest text-xs"
                      value={formData.checkin} onChange={e => setFormData({...formData, checkin: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-earth/40 ml-1">Check-out</label>
                    <input 
                      type="date" required 
                      className="w-full px-5 py-4 bg-beige border-none rounded-2xl focus:ring-2 focus:ring-forest text-xs"
                      value={formData.checkout} onChange={e => setFormData({...formData, checkout: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-earth/40 ml-1">Guests</label>
                  <input 
                    type="number" min="1" max="50" placeholder="Number of Guests" 
                    className="w-full px-5 py-4 bg-beige border-none rounded-2xl focus:ring-2 focus:ring-forest text-sm"
                    value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-earth/40 ml-1">Message</label>
                  <textarea 
                    placeholder="Tell us about your trip or special requirements..." 
                    className="w-full px-5 py-4 bg-beige border-none rounded-2xl focus:ring-2 focus:ring-forest h-24 text-sm"
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full bg-forest text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#c5a059] transition-all shadow-xl disabled:opacity-50 text-[10px]"
                >
                  {status === 'loading' ? 'Processing...' : 'Request Private Booking'}
                </button>
                <div className="text-center pt-4">
                  <span className="text-[10px] text-earth/40 uppercase tracking-widest block mb-4">Or discover us on</span>
                  <div className="flex justify-center gap-4">
                    <a 
                      href={airbnbUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-6 py-2 border border-beige rounded-full text-[10px] font-bold text-earth/60 hover:border-earth/20 hover:bg-beige/10 transition-all"
                    >
                      Airbnb
                    </a>
                    <a 
                      href={bookingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-6 py-2 border border-beige rounded-full text-[10px] font-bold text-earth/60 hover:border-earth/20 hover:bg-beige/10 transition-all"
                    >
                      Booking.com
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

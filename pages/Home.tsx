import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AMENITIES as STATIC_AMENITIES, FAQs as STATIC_FAQS, GALLERY_IMAGES as STATIC_GALLERY, BRAND_ASSETS, TESTIMONIALS as STATIC_TESTIMONIALS, ICONS } from '../constants';
import { supabase } from '../lib/supabase';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < (rating || 5) ? 'text-[#c5a059] fill-[#c5a059]' : 'text-earth/20 fill-earth/10'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>(STATIC_TESTIMONIALS);
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Rooms', 'Pool', 'Lawn', 'Bar Garden'];

  useEffect(() => {
    supabase.from('site_settings').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle().then(({ data }: any) => {
      if (data) setSettings(data);
    });

    supabase.from('testimonials').select('*').order('id', { ascending: false }).then(({ data }: any) => {
      if (data && data.length > 0) setTestimonials(data);
    });
  }, []);

  const heroImage = settings?.hero_image_url || BRAND_ASSETS.heroImage;
  const heroTitle = settings?.hero_title || 'Welcome to Heaven';
  const heroSubtitle = settings?.hero_subtitle || 'A sanctuary of elegance and luxury.';

  const filteredGallery = activeCategory === 'All' 
    ? STATIC_GALLERY.slice(0, 6) 
    : STATIC_GALLERY.filter(img => img.category === activeCategory).slice(0, 6);

  return (
    <div className="bg-beige overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#c5a059] uppercase tracking-[0.5em] font-bold text-xs mb-6"
          >
            {settings?.tagline || 'Estd. 2024 • Luxury Farmhouse'}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-5xl md:text-8xl font-serif mb-8 leading-tight"
          >
            {heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/stay" className="bg-[#c5a059] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-forest transition-all shadow-2xl text-[10px]">
              Book Your Stay
            </Link>
            <Link to="/events" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-forest transition-all text-[10px]">
              Host an Event
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Refined Section 2: Airbnb Style Editorial */}
      <section className="py-32 px-6 bg-white border-y border-beige/50">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* Left Content Column */}
            <div className="w-full lg:w-7/12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 text-left"
              >
                <div className="flex items-center mb-6">
                  <span className="bg-forest text-[#c5a059] text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm border border-white/10">
                    Entire Farm Stay : 5 Star Airbnb guest favourite
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-forest mb-6 leading-[1.1]">Luxury of Tranquility</h2>
                
                {/* 2b: Property Stats Line */}
                <div className="mb-8 flex items-center gap-2">
                   <p className="text-[#c5a059] text-xs font-bold uppercase tracking-widest">
                     24 guests <span className="mx-2 opacity-30 text-forest">|</span> 
                     8 suite Bedrooms <span className="mx-2 opacity-30 text-forest">|</span> 
                     1 presidential Suite <span className="mx-2 opacity-30 text-forest">|</span> 
                     4 Lawns
                   </p>
                </div>

                <p className="text-earth/60 text-lg font-light leading-relaxed max-w-2xl mb-12">
                  Immerse yourself in a bespoke sanctuary designed for group stays and high-end retreats. 
                  Experience the pinnacle of Jaipur's hospitality with 8 private suites, sprawling gardens, 
                  and a dedicated on-site team.
                </p>

                {/* Amenity Buttons UI */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
                  {STATIC_AMENITIES.map((amenity, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 px-4 py-3 bg-beige/30 hover:bg-forest hover:text-white border border-beige/60 rounded-xl transition-all duration-300 group cursor-default"
                    >
                      <div className="w-6 h-6 flex items-center justify-center text-forest group-hover:text-[#c5a059] transition-colors">
                        <amenity.icon />
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-[0.1em]">
                        {amenity.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-8 border-t border-beige/50">
                  <Link to="/stay" className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-forest hover:text-[#c5a059] transition-colors group">
                    View Full Experience
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Image Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full lg:w-5/12"
            >
              <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-beige/30">
                <img 
                  src="https://images.unsplash.com/photo-1544161515-4af6b1d8d16e?auto=format&fit=crop&q=80&w=1200" 
                  alt="Airbnb Luxury Experience" 
                  className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                
                {/* Floating Airbnb-style Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50">
                  <div className="w-10 h-10 bg-[#c5a059] rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-forest">Verified Stay</p>
                    <p className="text-[12px] text-earth/60 font-light">Superhost Property</p>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <Link to="/gallery" className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-forest transition-all flex items-center gap-2 w-fit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Show all photos
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-32 bg-forest text-white px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <p className="text-[#c5a059] uppercase tracking-widest text-xs font-bold mb-4">Glimpses of Grandeur</p>
              <h2 className="text-4xl md:text-6xl font-serif">The Property</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#c5a059] text-white' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((img) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={img.id} 
                  className="aspect-[4/3] rounded-[2rem] overflow-hidden group relative"
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <p className="text-[#c5a059] text-[10px] uppercase tracking-widest font-bold mb-2">{img.category}</p>
                    <h4 className="text-xl font-serif">{img.title}</h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-20 text-center">
            <Link to="/gallery" className="inline-flex items-center gap-4 text-[#c5a059] uppercase tracking-[0.3em] font-bold text-xs hover:gap-6 transition-all">
              View Full Gallery
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif text-forest">Guest Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm border border-earth/5">
                <StarRating rating={t.rating} />
                <div className="flex items-center gap-4 mb-8">
                  <img src={t.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-[10px] text-earth/40 uppercase tracking-widest">{t.context}</p>
                  </div>
                </div>
                <p className="text-earth/70 italic leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-beige px-6 border-t border-earth/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-serif text-forest text-center mb-20">Frequently Asked</h2>
          <div className="space-y-6">
            {STATIC_FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <h4 className="font-serif text-xl text-forest mb-4">{faq.q}</h4>
                <p className="text-earth/60 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

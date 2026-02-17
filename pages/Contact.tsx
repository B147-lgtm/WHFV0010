import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export const Contact: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }: any) => {
      if (data) setSettings(data);
    });
  }, []);

  const address = settings?.address_text || '631,632, green triveni, Opp. ashiana greens, sikar road, Jaipur - 302013';
  const phone = settings?.phone_number || '+91 88520 21119';
  const email = settings?.email_address || 'woodheavenfarms@gmail.com';
  // Standardized Google Maps search query for Wood Heaven Farms, Sikar Road, Jaipur
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=Wood+Heaven+Farms+Sikar+Road+Jaipur`;

  return (
    <div className="pt-24 min-h-screen bg-beige">
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h1 className="text-6xl font-serif text-forest mb-8">Get in Touch</h1>
              <p className="text-earth/60 text-lg mb-12 max-w-md">Have questions about Wood Heaven Farms? We're here to help you plan your perfect stay or event.</p>
              
              <div className="space-y-10">
                <a 
                  href={mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex gap-6 group hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-earth shadow-sm flex-shrink-0 group-hover:bg-[#c5a059] group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Address</h4>
                    <p className="text-earth/60 group-hover:text-forest transition-colors">{address}</p>
                    <span className="text-[10px] text-[#c5a059] font-bold uppercase tracking-widest mt-1 block">View on Google Maps →</span>
                  </div>
                </a>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-earth shadow-sm flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Email & Phone</h4>
                    <p className="text-earth/60">{email}</p>
                    <p className="text-earth/60">{phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-20">
                <h4 className="font-bold uppercase tracking-widest text-xs mb-4">Follow us on Instagram</h4>
                <div className="flex gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-16 h-16 bg-earth/10 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
                      <img src={`https://picsum.photos/seed/${i}/100`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl h-[600px] border-8 border-white relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.496582531653!2d75.76816387538965!3d26.985652476594396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db37936a2817d%3A0x93700030589a1945!2sWood%20Heaven%20Farms!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              />
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-forest/0 hover:bg-forest/5 transition-colors flex items-center justify-center group"
              >
                <span className="bg-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-forest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">Open Large Map</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
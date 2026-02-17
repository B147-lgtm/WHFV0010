
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES as STATIC_IMAGES } from '../constants';
import { supabase } from '../lib/supabase';

// Full implementation of Gallery component to resolve compilation errors
export const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [images, setImages] = useState<any[]>(STATIC_IMAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (data && data.length > 0) {
        setImages([...STATIC_IMAGES, ...data]);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(images.map(img => img.category))];
  const filteredImages = activeFilter === 'All' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  return (
    <div className="pt-24 min-h-screen bg-beige">
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-serif text-forest mb-6">Visual Story</h1>
            <p className="text-earth/60 uppercase tracking-[0.4em] text-xs font-bold">A journey through Wood Heaven Farms</p>
          </div>

          <div className="flex justify-center gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-forest text-white shadow-xl' : 'bg-white text-forest hover:bg-forest/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredImages.map((img, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={img.id || idx} 
                  className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-xl relative group"
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-12">
                    <p className="text-[#c5a059] text-[10px] uppercase font-bold tracking-widest mb-2">{img.category}</p>
                    <h3 className="text-white text-3xl font-serif">{img.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

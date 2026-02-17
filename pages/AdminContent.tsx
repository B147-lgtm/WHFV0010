import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/adminGuard';
import { useNavigate } from 'react-router-dom';

const TABLES = [
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'faqs', name: 'FAQs' },
  { id: 'highlights', name: 'Amenities' }
];

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 mb-2">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${i < (rating || 5) ? 'text-[#c5a059] fill-[#c5a059]' : 'text-earth/20 fill-earth/10'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export const AdminContent: React.FC = () => {
  const [activeTable, setActiveTable] = useState<string>('testimonials');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    verifyAccess();
  }, [activeTable, navigate]);

  const verifyAccess = async () => {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      navigate('/admin');
    } else {
      fetchContent();
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(activeTable).select('*').order('id', { ascending: false });
      if (data) setItems(data);
    } catch (err) {
      console.error(`Error fetching ${activeTable}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Permanently remove this entry?')) return;
    const { error } = await supabase.from(activeTable).delete().eq('id', id);
    if (!error) fetchContent();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Default rating to 5 if not set for testimonials
    const payload = activeTable === 'testimonials' 
      ? { ...editingItem, rating: editingItem.rating || 5 }
      : editingItem;

    const { error } = await supabase.from(activeTable).upsert(payload);
    if (!error) {
      setEditingItem(null);
      fetchContent();
    } else {
      alert('Error saving: ' + error.message);
    }
  };

  if (loading) return <div className="p-20 text-center font-serif text-2xl text-forest">Synchronizing content cloud...</div>;

  return (
    <div className="pt-24 min-h-screen bg-beige p-6">
      <div className="container mx-auto">
        <div className="bg-white rounded-[4rem] shadow-2xl p-12 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div>
              <h1 className="text-4xl font-serif text-forest mb-2">Content Manager</h1>
              <p className="text-[10px] uppercase tracking-widest text-earth/40 font-bold">Refine the text and social proof across the site</p>
            </div>
            <div className="flex bg-beige p-1.5 rounded-[1.5rem] shadow-inner overflow-x-auto max-w-full">
              {TABLES.map(table => (
                <button 
                  key={table.id}
                  onClick={() => setActiveTable(table.id)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTable === table.id ? 'bg-forest text-white shadow-lg' : 'text-forest/60 hover:bg-forest/5'}`}
                >
                  {table.name}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setEditingItem({ rating: 5 })}
              className="bg-[#c5a059] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-forest transition-all"
            >
              Add New
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item) => (
              <div key={item.id} className="bg-beige/20 p-8 rounded-[3rem] border border-white group relative shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingItem(item)} className="w-10 h-10 rounded-full bg-white text-forest shadow-md flex items-center justify-center hover:bg-forest hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="w-10 h-10 rounded-full bg-white text-red-500 shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                
                {activeTable === 'testimonials' && (
                  <div className="space-y-4">
                    <StarDisplay rating={item.rating} />
                    <div className="flex items-center gap-4">
                      <img src={item.image || 'https://via.placeholder.com/100'} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div>
                        <h4 className="font-bold text-forest text-sm">{item.name}</h4>
                        <p className="text-[10px] text-earth/40 uppercase tracking-widest">{item.context}</p>
                      </div>
                    </div>
                    <p className="text-sm italic text-earth/70 leading-relaxed">"{item.text}"</p>
                  </div>
                )}
                
                {activeTable === 'faqs' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-xl text-forest leading-snug">{item.question}</h4>
                    <p className="text-xs text-earth/60 leading-relaxed">{item.answer}</p>
                  </div>
                )}

                {activeTable === 'highlights' && (
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-forest shadow-sm border border-earth/5">
                      {item.icon_name || '★'}
                    </div>
                    <h4 className="font-bold text-forest tracking-wide uppercase text-xs">{item.name}</h4>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-forest/90 backdrop-blur-md flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-3xl font-serif text-forest mb-10">
              {editingItem.id ? 'Modify Entry' : 'Create New Entry'}
            </h2>
            <form onSubmit={handleSave} className="space-y-8">
              {activeTable === 'testimonials' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-earth/40 ml-1">Star Rating</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, rating: num })}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            (editingItem.rating || 5) >= num ? 'bg-[#c5a059] text-white' : 'bg-beige text-earth/30'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-earth/40 ml-1">Guest Name</label>
                      <input value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-beige/50 border-none rounded-2xl px-6 py-4 text-sm" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-earth/40 ml-1">Context (e.g. Corporate)</label>
                      <input value={editingItem.context || ''} onChange={e => setEditingItem({...editingItem, context: e.target.value})} className="w-full bg-beige/50 border-none rounded-2xl px-6 py-4 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-earth/40 ml-1">Review Text</label>
                    <textarea value={editingItem.text || ''} onChange={e => setEditingItem({...editingItem, text: e.target.value})} className="w-full bg-beige/50 border-none rounded-2xl px-6 py-4 text-sm h-32 leading-relaxed" required />
                  </div>
                </div>
              )}
              
              {activeTable === 'faqs' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-earth/40 ml-1">Question</label>
                    <input value={editingItem.question || ''} onChange={e => setEditingItem({...editingItem, question: e.target.value})} className="w-full bg-beige/50 border-none rounded-2xl px-6 py-4 text-sm font-serif" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-earth/40 ml-1">Answer</label>
                    <textarea value={editingItem.answer || ''} onChange={e => setEditingItem({...editingItem, answer: e.target.value})} className="w-full bg-beige/50 border-none rounded-2xl px-6 py-4 text-sm h-32 leading-relaxed" required />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-grow bg-forest text-white py-5 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-[#c5a059] transition-all text-[10px]">
                  Publish Entry
                </button>
                <button type="button" onClick={() => setEditingItem(null)} className="px-10 py-5 bg-beige text-earth/60 rounded-full font-bold uppercase tracking-widest text-[10px]">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

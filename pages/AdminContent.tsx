import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/adminGuard';
import { useNavigate } from 'react-router-dom';

const TABLES = [
  { id: 'testimonials', name: 'Guest Testimonials', desc: 'Manage home page reviews' },
  { id: 'faqs', name: 'Site FAQs', desc: 'Update common questions' },
  { id: 'amenity_groups', name: 'Property Features', desc: 'Edit amenity groups' },
  { id: 'event_spaces', name: 'Venue Capacities', desc: 'Manage event spots' },
  { id: 'house_rules', name: 'Sanctuary Rules', desc: 'Edit guest guidelines' }
];

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
    if (!isAdmin) navigate('/admin');
    else fetchContent();
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from(activeTable).select('*').order('id', { ascending: false });
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
    const { error } = await supabase.from(activeTable).upsert(editingItem);
    if (!error) {
      setEditingItem(null);
      fetchContent();
    } else {
      alert('Error saving: ' + error.message);
    }
  };

  if (loading) return <div className="p-20 text-center font-serif text-2xl text-forest animate-pulse">Synchronizing Vault Content...</div>;

  return (
    <div className="space-y-12">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-12">
        <div>
          <h1 className="text-6xl font-serif text-forest mb-4">Universal Editor</h1>
          <p className="text-[11px] uppercase tracking-[0.6em] text-earth/30 font-black">Content Management • Real-time Sync</p>
        </div>
        <button onClick={() => setEditingItem({})} className="bg-forest text-white px-12 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-[#c5a059] transition-all text-[11px]">
          Add New Record
        </button>
      </header>

      {/* Category Selection Sidebar/Header Hybrid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {TABLES.map(table => (
            <button 
              key={table.id}
              onClick={() => setActiveTable(table.id)}
              className={`w-full text-left p-6 rounded-3xl transition-all duration-300 border flex flex-col gap-1 ${activeTable === table.id ? 'bg-forest text-white border-forest shadow-xl scale-105' : 'bg-white border-earth/5 text-forest hover:bg-beige/50'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{table.name}</span>
              <span className={`text-[9px] opacity-40 group-hover:opacity-60 ${activeTable === table.id ? 'text-white/60' : 'text-earth'}`}>{table.desc}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-4 bg-white rounded-[4rem] shadow-2xl p-12 border border-white relative overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {items.map((item) => (
              <div key={item.id} className="bg-beige/30 p-10 rounded-[3.5rem] border border-white group relative shadow-sm hover:shadow-xl transition-all">
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingItem(item)} className="w-10 h-10 rounded-full bg-white text-forest shadow-md flex items-center justify-center hover:bg-forest hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="w-10 h-10 rounded-full bg-white text-red-500 shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                
                {activeTable === 'testimonials' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image || "https://via.placeholder.com/100"} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div>
                        <h4 className="font-bold text-forest text-sm">{item.name}</h4>
                        <p className="text-[9px] text-earth/40 uppercase font-black tracking-widest">{item.context}</p>
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

                {activeTable === 'amenity_groups' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-2xl text-forest">{item.title}</h4>
                    <ul className="space-y-1">
                      {item.items?.slice(0, 3).map((li: string, i: number) => (
                        <li key={i} className="text-[10px] text-earth/60 font-bold uppercase">• {li}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTable === 'event_spaces' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-2xl text-forest">{item.name}</h4>
                    <p className="text-[10px] font-black uppercase text-[#c5a059] tracking-widest">{item.capacity}</p>
                    <p className="text-xs text-earth/60 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                )}

                {activeTable === 'house_rules' && (
                  <div className="flex items-start gap-4">
                    <span className="font-black text-forest text-lg">0{item.sort_order}.</span>
                    <p className="text-sm text-earth/80 leading-relaxed">{item.rule_text}</p>
                  </div>
                )}
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full py-32 text-center">
                <p className="text-4xl font-serif text-earth/10 italic">This sector is currently vacant.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-over Modal Editor */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] bg-forest/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-serif text-forest mb-2">{editingItem.id ? 'Refine Record' : 'Create Record'}</h2>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-earth/40 font-black">Segment: {activeTable}</p>
                </div>
                <button onClick={() => setEditingItem(null)} className="w-12 h-12 bg-beige rounded-full flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                {activeTable === 'testimonials' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-4 text-earth/40">Guest Identity</label>
                      <input value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="e.g. Aditi Sharma" className="w-full bg-beige/50 border-none rounded-2xl px-8 py-5 text-sm" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-4 text-earth/40">Context / Occasion</label>
                      <input value={editingItem.context || ''} onChange={e => setEditingItem({...editingItem, context: e.target.value})} placeholder="e.g. Corporate Offsite" className="w-full bg-beige/50 border-none rounded-2xl px-8 py-5 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black ml-4 text-earth/40">Narrative</label>
                      <textarea value={editingItem.text || ''} onChange={e => setEditingItem({...editingItem, text: e.target.value})} placeholder="The experience details..." className="w-full bg-beige/50 border-none rounded-3xl px-8 py-5 text-sm h-40 leading-relaxed" required />
                    </div>
                  </div>
                )}
                
                {/* Fallback for other tables follows original simple logic but updated UI classes */}
                {activeTable !== 'testimonials' && (
                  <div className="space-y-6">
                    {/* Simplified dynamic fields for brevity, maintaining consistency */}
                    {Object.keys(items[0] || {}).filter(k => k !== 'id' && k !== 'created_at').map(key => (
                      <div key={key} className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black ml-4 text-earth/40">{key.replace('_', ' ')}</label>
                        {Array.isArray(editingItem[key]) ? (
                           <textarea value={editingItem[key]?.join('\n') || ''} onChange={e => setEditingItem({...editingItem, [key]: e.target.value.split('\n')})} placeholder="One item per line" className="w-full bg-beige/50 border-none rounded-2xl px-8 py-5 text-sm h-32" />
                        ) : (
                           <input value={editingItem[key] || ''} onChange={e => setEditingItem({...editingItem, [key]: e.target.value})} className="w-full bg-beige/50 border-none rounded-2xl px-8 py-5 text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-6 pt-8">
                  <button type="submit" className="flex-grow bg-forest text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:bg-[#c5a059] transition-all">
                    Commit to Vault
                  </button>
                  <button type="button" onClick={() => setEditingItem(null)} className="px-12 py-7 bg-beige text-forest rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px]">
                    Dismiss
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

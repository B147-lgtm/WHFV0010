import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/adminGuard';
import { useNavigate } from 'react-router-dom';

const TABLES = [
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'faqs', name: 'FAQs' },
  { id: 'amenity_groups', name: 'Amenity Groups' },
  { id: 'event_spaces', name: 'Event Spaces' },
  { id: 'house_rules', name: 'House Rules' }
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
    <div className="pt-24 min-h-screen bg-beige p-6 selection:bg-forest selection:text-white">
      <div className="container mx-auto">
        <div className="bg-white rounded-[4rem] shadow-2xl p-12 border border-white/50">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-serif text-forest mb-2">Universal Editor</h1>
              <p className="text-[11px] uppercase tracking-[0.4em] text-earth/40 font-black">Manage Every Text on Wood Heaven</p>
            </div>
            <div className="flex bg-beige/50 p-2 rounded-[2rem] shadow-inner overflow-x-auto max-w-full no-scrollbar">
              {TABLES.map(table => (
                <button 
                  key={table.id}
                  onClick={() => setActiveTable(table.id)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTable === table.id ? 'bg-forest text-white shadow-xl' : 'text-forest/40 hover:text-forest'}`}
                >
                  {table.name}
                </button>
              ))}
            </div>
            <button onClick={() => setEditingItem({})} className="bg-[#c5a059] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-xl hover:bg-forest transition-all text-[10px]">
              Add New Record
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <h4 className="font-bold text-forest text-sm">{item.name}</h4>
                    <p className="text-[10px] text-earth/40 uppercase font-black tracking-widest">{item.context}</p>
                    <p className="text-sm italic text-earth/70 leading-relaxed">"{item.text}"</p>
                  </div>
                )}
                
                {activeTable === 'faqs' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-xl text-forest leading-snug">{item.question}</h4>
                    <p className="text-xs text-earth/60 leading-relaxed line-clamp-3">{item.answer}</p>
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
                    <p className="text-xs text-earth/60 leading-relaxed">{item.description}</p>
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
          </div>
        </div>
      </div>

      {/* Dynamic Modal Editor */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] bg-forest/95 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-serif text-forest mb-10">{editingItem.id ? 'Modify Record' : 'Create New Record'}</h2>
            <form onSubmit={handleSave} className="space-y-8">
              {activeTable === 'testimonials' && (
                <div className="space-y-6">
                  <input value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="Guest Name" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm" required />
                  <input value={editingItem.context || ''} onChange={e => setEditingItem({...editingItem, context: e.target.value})} placeholder="Context (e.g. Wedding)" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm" />
                  <textarea value={editingItem.text || ''} onChange={e => setEditingItem({...editingItem, text: e.target.value})} placeholder="Review Text" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm h-32" required />
                </div>
              )}
              {activeTable === 'amenity_groups' && (
                <div className="space-y-6">
                  <input value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} placeholder="Group Title (e.g. Leisure)" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm" required />
                  <textarea value={editingItem.items?.join('\n') || ''} onChange={e => setEditingItem({...editingItem, items: e.target.value.split('\n')})} placeholder="Items (One per line)" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm h-48" />
                </div>
              )}
              {activeTable === 'event_spaces' && (
                <div className="space-y-6">
                  <input value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="Space Name" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm" required />
                  <input value={editingItem.capacity || ''} onChange={e => setEditingItem({...editingItem, capacity: e.target.value})} placeholder="Capacity (e.g. 150 Guests)" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm" />
                  <textarea value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} placeholder="Description" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm h-32" />
                </div>
              )}
              {activeTable === 'house_rules' && (
                <div className="space-y-6">
                  <input type="number" value={editingItem.sort_order || 1} onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value)})} placeholder="Order" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm" />
                  <textarea value={editingItem.rule_text || ''} onChange={e => setEditingItem({...editingItem, rule_text: e.target.value})} placeholder="Rule Content" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm h-32" required />
                </div>
              )}
              {activeTable === 'faqs' && (
                <div className="space-y-6">
                   <input value={editingItem.question || ''} onChange={e => setEditingItem({...editingItem, question: e.target.value})} placeholder="Question" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm" required />
                   <textarea value={editingItem.answer || ''} onChange={e => setEditingItem({...editingItem, answer: e.target.value})} placeholder="Answer" className="w-full bg-beige border-none rounded-2xl px-6 py-5 text-sm h-32" required />
                </div>
              )}
              <div className="flex gap-4">
                <button type="submit" className="flex-grow bg-forest text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[10px]">Commit Changes</button>
                <button type="button" onClick={() => setEditingItem(null)} className="px-10 py-6 bg-beige text-forest rounded-3xl font-black uppercase tracking-widest text-[10px]">Dismiss</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

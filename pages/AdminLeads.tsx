import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/adminGuard';
import { useNavigate } from 'react-router-dom';

export const AdminLeads: React.FC = () => {
  const [stays, setStays] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stays' | 'events'>('stays');
  const navigate = useNavigate();

  useEffect(() => {
    verifyAccess();
  }, [navigate]);

  const verifyAccess = async () => {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      navigate('/admin');
    } else {
      fetchLeads();
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const [staysRes, eventsRes] = await Promise.all([
        supabase.from('stay_enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('event_enquiries').select('*').order('created_at', { ascending: false })
      ]);

      if (staysRes.data) setStays(staysRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, table: string, status: string) => {
    const { error } = await supabase.from(table).update({ status }).eq('id', id);
    if (!error) fetchLeads();
  };

  if (loading) return null;

  return (
    <div className="space-y-12">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-serif text-forest mb-4">Lead Intelligence</h1>
          <p className="text-[11px] uppercase tracking-[0.6em] text-earth/30 font-black">CRM Gateway • Enquiry Orchestration</p>
        </div>
        <div className="flex bg-white p-2 rounded-[2rem] shadow-xl border border-earth/5">
          <button 
            onClick={() => setActiveTab('stays')}
            className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stays' ? 'bg-forest text-white shadow-xl' : 'text-forest/40 hover:text-forest'}`}
          >
            Stay Bookings
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-forest text-white shadow-xl' : 'text-forest/40 hover:text-forest'}`}
          >
            Event Proposals
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[4rem] shadow-2xl border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-beige/30 border-b border-earth/5">
                <th className="py-8 px-10 text-[10px] uppercase tracking-[0.3em] font-black text-earth/30">Client Entity</th>
                <th className="py-8 px-10 text-[10px] uppercase tracking-[0.3em] font-black text-earth/30">Engagement Period</th>
                <th className="py-8 px-10 text-[10px] uppercase tracking-[0.3em] font-black text-earth/30 text-center">Volume</th>
                <th className="py-8 px-10 text-[10px] uppercase tracking-[0.3em] font-black text-earth/30">Phase</th>
                <th className="py-8 px-10 text-[10px] uppercase tracking-[0.3em] font-black text-earth/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth/5">
              {(activeTab === 'stays' ? stays : events).map((lead) => (
                <tr key={lead.id} className="group hover:bg-beige/10 transition-colors">
                  <td className="py-10 px-10">
                    <p className="font-bold text-forest text-lg mb-1 leading-none">{lead.name}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-earth/30">{lead.phone}</p>
                  </td>
                  <td className="py-10 px-10">
                    {activeTab === 'stays' ? (
                      <div>
                        <p className="text-sm font-serif text-forest mb-1">{lead.checkin} — {lead.checkout}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#c5a059]">Duration: {Math.ceil((new Date(lead.checkout).getTime() - new Date(lead.checkin).getTime()) / (1000 * 60 * 60 * 24))} Days</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-serif text-forest mb-1">{lead.event_date}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#c5a059]">{lead.event_type} Special</p>
                      </div>
                    )}
                  </td>
                  <td className="py-10 px-10 text-center">
                    <span className="text-2xl font-serif text-forest">{lead.guests}</span>
                    <p className="text-[8px] font-black uppercase text-earth/20 tracking-widest">Guests</p>
                  </td>
                  <td className="py-10 px-10">
                    <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                      lead.status === 'contacted' ? 'bg-[#c5a059]/10 text-[#c5a059]' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-10 px-10 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => updateStatus(lead.id, activeTab === 'stays' ? 'stay_enquiries' : 'event_enquiries', 'contacted')}
                        className="px-6 py-2 bg-beige text-forest rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all"
                      >
                        Acknowledge
                      </button>
                      <button 
                        onClick={() => updateStatus(lead.id, activeTab === 'stays' ? 'stay_enquiries' : 'event_enquiries', 'booked')}
                        className="px-6 py-2 bg-forest text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:shadow-xl transition-all"
                      >
                        Convert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(activeTab === 'stays' ? stays : events).length === 0 && (
            <div className="py-32 text-center">
              <p className="text-4xl font-serif text-earth/10 italic">No enquiries currently in the queue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

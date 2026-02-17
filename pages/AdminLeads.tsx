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

  if (loading) return <div className="p-20 text-center font-serif">Connecting to CRM...</div>;

  return (
    <div className="pt-24 min-h-screen bg-beige p-6">
      <div className="container mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl p-10">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-serif text-forest">Enquiry Dashboard</h1>
            <div className="flex bg-beige p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('stays')}
                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'stays' ? 'bg-forest text-white shadow-lg' : 'text-forest'}`}
              >
                Stays
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-forest text-white shadow-lg' : 'text-forest'}`}
              >
                Events
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-earth/10">
                  <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-earth/40">Details</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-earth/40">Schedule</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-earth/40">Guests</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-earth/40">Status</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-widest font-bold text-earth/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth/5">
                {(activeTab === 'stays' ? stays : events).map((lead) => (
                  <tr key={lead.id} className="group hover:bg-beige/30 transition-colors">
                    <td className="py-8 px-4">
                      <p className="font-bold text-forest mb-1">{lead.name}</p>
                      <p className="text-sm text-earth/60">{lead.phone}</p>
                    </td>
                    <td className="py-8 px-4">
                      {activeTab === 'stays' ? (
                        <p className="text-sm font-serif text-forest">{lead.checkin} — {lead.checkout}</p>
                      ) : (
                        <p className="text-sm font-serif text-forest">{lead.event_date} ({lead.event_type})</p>
                      )}
                    </td>
                    <td className="py-8 px-4 font-bold text-forest">{lead.guests}</td>
                    <td className="py-8 px-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-600' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-8 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(lead.id, activeTab === 'stays' ? 'stay_enquiries' : 'event_enquiries', 'contacted')} className="w-8 h-8 rounded-full bg-white border border-earth/10 flex items-center justify-center hover:bg-yellow-50 text-yellow-600 transition-colors">C</button>
                        <button onClick={() => updateStatus(lead.id, activeTab === 'stays' ? 'stay_enquiries' : 'event_enquiries', 'booked')} className="w-8 h-8 rounded-full bg-white border border-earth/10 flex items-center justify-center hover:bg-green-50 text-green-600 transition-colors">B</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

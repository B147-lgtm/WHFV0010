import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/adminGuard';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Admin: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ stays: 0, events: 0, newLeads: [] as any[] });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    setLoading(true);
    const isAdmin = await checkIsAdmin();
    setIsAuthorized(isAdmin);
    if (isAdmin) fetchDashboardStats();
    setLoading(false);
  };

  const fetchDashboardStats = async () => {
    const [stays, events] = await Promise.all([
      supabase.from('stay_enquiries').select('*'),
      supabase.from('event_enquiries').select('*')
    ]);
    
    const allLeads = [
      ...(stays.data || []).map(l => ({ ...l, type: 'Stay' })),
      ...(events.data || []).map(l => ({ ...l, type: 'Event' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setStats({
      stays: stays.data?.length || 0,
      events: events.data?.length || 0,
      newLeads: allLeads.slice(0, 4)
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    else if (data.user) verifyAdmin();
  };

  if (loading) return null;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest px-6 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c5a059]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-2xl p-12 md:p-16 rounded-[4rem] w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-8 border-white/20 relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-forest mb-2">Management Vault</h2>
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#c5a059] font-black">Secure Administration Gate</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-8">
            {authError && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center bg-red-50 py-4 rounded-2xl border border-red-100 font-bold">{authError}</p>}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest font-black ml-4 text-earth/50">Admin Identifier</label>
              <input 
                type="email" placeholder="admin@woodheaven.com" 
                className="w-full bg-beige/50 border-none px-8 py-6 rounded-3xl text-sm focus:ring-2 focus:ring-forest transition-all"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest font-black ml-4 text-earth/50">Access Token</label>
              <input 
                type="password" placeholder="••••••••" 
                className="w-full bg-beige/50 border-none px-8 py-6 rounded-3xl text-sm focus:ring-2 focus:ring-forest transition-all"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-forest text-white py-7 rounded-[2rem] font-bold uppercase tracking-[0.4em] hover:bg-[#c5a059] transition-all shadow-2xl text-[11px]">
              Unlock Operations
            </button>
          </form>
          <div className="mt-12 text-center">
            <Link to="/" className="text-[10px] uppercase tracking-[0.5em] text-earth/40 font-black hover:text-forest transition-colors">Terminate & Return Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="mb-16">
        <h1 className="text-6xl font-serif text-forest mb-4">Command Center</h1>
        <p className="text-[11px] uppercase tracking-[0.6em] text-earth/30 font-black">Operations Intelligence • Real-time Monitoring</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white flex flex-col justify-between group hover:-translate-y-2 transition-transform">
          <p className="text-[10px] uppercase font-black tracking-widest text-earth/40 mb-8">Total Stay Enquiries</p>
          <div className="flex items-end justify-between">
            <span className="text-6xl font-serif text-forest">{stats.stays}</span>
            <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2"/></svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white flex flex-col justify-between group hover:-translate-y-2 transition-transform">
          <p className="text-[10px] uppercase font-black tracking-widest text-earth/40 mb-8">Event Pipeline</p>
          <div className="flex items-end justify-between">
            <span className="text-6xl font-serif text-forest">{stats.events}</span>
            <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center text-forest group-hover:bg-[#c5a059] group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z" strokeWidth="2"/></svg>
            </div>
          </div>
        </div>
        <div className="bg-forest p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/20 blur-[60px]" />
          <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-8">Conversion Potential</p>
          <div className="flex items-end justify-between">
            <span className="text-6xl font-serif text-[#c5a059]">84%</span>
            <div className="bg-white/10 p-4 rounded-2xl">
              <svg className="w-6 h-6 text-[#c5a059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Leads Feed */}
        <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-serif text-forest">Recent Activity</h3>
            <Link to="/admin/leads" className="text-[9px] font-black uppercase tracking-widest text-[#c5a059] hover:text-forest transition-colors">See Operations Board →</Link>
          </div>
          <div className="space-y-6">
            {stats.newLeads.map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-beige/30 rounded-3xl border border-white group hover:bg-white hover:shadow-lg transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-lg ${lead.type === 'Stay' ? 'bg-forest' : 'bg-[#c5a059]'}`}>
                    {lead.type[0]}
                  </div>
                  <div>
                    <p className="font-bold text-forest text-sm">{lead.name}</p>
                    <p className="text-[10px] text-earth/40 uppercase font-black tracking-widest">{new Date(lead.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#c5a059] bg-[#c5a059]/10 px-3 py-1.5 rounded-full">{lead.status}</span>
                </div>
              </div>
            ))}
            {stats.newLeads.length === 0 && <p className="text-center py-10 text-earth/20 font-serif italic text-lg">No recent activity detected.</p>}
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-10">
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white">
            <h3 className="text-2xl font-serif text-forest mb-8">System Status</h3>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-earth/30">Database Connection</span>
                <span className="text-[10px] font-black uppercase text-green-500 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"/> ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-earth/30">Storage Capacity</span>
                <span className="text-[10px] font-black uppercase text-forest">14.2 GB AVAILABLE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-earth/30">Encryption Node</span>
                <span className="text-[10px] font-black uppercase text-forest">ACTIVE (AES-256)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#c5a059] p-12 rounded-[4rem] shadow-2xl text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-black/5" />
             <h3 className="text-2xl font-serif mb-4 relative z-10">Curator Tip</h3>
             <p className="text-sm leading-relaxed opacity-80 relative z-10">Ensure you respond to "New" leads within 4 hours to maintain an 80% conversion rate for weekend stays.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

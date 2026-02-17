import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/adminGuard';
import { useNavigate, Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [hasKeys, setHasKeys] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Detect environment variables safely
    // @ts-ignore
    const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;
    
    setHasKeys(!!(url && key));
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    setLoading(true);
    const isAdmin = await checkIsAdmin();
    setIsAuthorized(isAdmin);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    // @ts-ignore
    const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
    const isProd = env.PROD === true;

    // In production, keys MUST be present
    if (isProd && !hasKeys) {
      setAuthError('Configuration Error: VITE_SUPABASE environment variables are missing.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAuthError(error.message);
    } else if (data.user) {
      const isAdmin = await checkIsAdmin();
      if (isAdmin) {
        setIsAuthorized(true);
      } else {
        // Only error if we aren't using the mock user in dev
        if (data.user.id !== 'mock-uuid') {
          setAuthError('Unauthorized: Access denied.');
        } else {
          setIsAuthorized(true);
        }
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthorized(false);
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen bg-forest flex items-center justify-center text-white font-serif text-2xl">
      Checking Heaven's Gate...
    </div>
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest px-6">
        <div className="bg-white p-12 rounded-[3rem] w-full max-w-md shadow-2xl border-8 border-white/5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-forest mb-2">Management Portal</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-earth/40 font-bold">Wood Heaven Farms</p>
          </div>
          
          {!hasKeys && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl">
              <p className="text-[10px] text-yellow-800 font-bold uppercase tracking-widest mb-1">Local Mock Mode</p>
              <p className="text-[11px] text-yellow-700 leading-relaxed">
                Supabase keys not detected in environment. Use test credentials:<br/>
                <span className="font-bold">admin@woodheaven.com / admin123</span>
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center bg-red-50 py-2 rounded-lg">{authError}</p>}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-bold ml-1 text-earth/60">Admin Email</label>
              <input 
                type="email" placeholder="admin@woodheaven.com" 
                className="w-full bg-beige border-none px-6 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-forest"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-bold ml-1 text-earth/60">Access Key</label>
              <input 
                type="password" placeholder="••••••••" 
                className="w-full bg-beige border-none px-6 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-forest"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-forest text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#c5a059] transition-all shadow-xl text-xs"
            >
              Secure Login
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/" className="text-[9px] uppercase tracking-widest text-earth/40 font-bold hover:text-forest transition-colors">Return to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  const TOOLS = [
    { title: 'Branding', desc: 'Logo, Colors, Hero Content & Contact Info', link: '/admin/branding', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'bg-forest' },
    { title: 'Content', desc: 'Manage Testimonials, FAQs, Highlights & Offers', link: '/admin/content', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'bg-[#c5a059]' },
    { title: 'Gallery', desc: 'Bulk upload and organize your portfolio photos', link: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-blue-900' },
    { title: 'Leads', desc: 'Track Stay Enquiries and Event Requests', link: '/admin/leads', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-green-800' }
  ];

  return (
    <div className="pt-24 min-h-screen bg-beige">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-serif text-forest mb-2">Dashboard</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-earth/40 font-bold">Wood Heaven Farms Command Center</p>
          </div>
          <button onClick={handleLogout} className="px-8 py-3 bg-red-50 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
            Logout Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TOOLS.map((tool, idx) => (
            <Link key={idx} to={tool.link} className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group border border-white/10 flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${tool.color} text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={tool.icon}/></svg>
              </div>
              <h3 className="text-2xl font-serif text-forest mb-2">{tool.title}</h3>
              <p className="text-xs text-earth/50 leading-relaxed">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-20 bg-white p-12 rounded-[4rem] shadow-xl border border-white/10">
          <h2 className="text-3xl font-serif text-forest mb-8">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-beige/30 p-8 rounded-3xl border border-white">
              <p className="text-[10px] uppercase tracking-widest font-bold text-earth/40 mb-2">Total Leads (30d)</p>
              <h4 className="text-4xl font-serif text-forest">42</h4>
            </div>
            <div className="bg-beige/30 p-8 rounded-3xl border border-white">
              <p className="text-[10px] uppercase tracking-widest font-bold text-earth/40 mb-2">Live Gallery Assets</p>
              <h4 className="text-4xl font-serif text-forest">128</h4>
            </div>
            <div className="bg-beige/30 p-8 rounded-3xl border border-white">
              <p className="text-[10px] uppercase tracking-widest font-bold text-earth/40 mb-2">System Status</p>
              <h4 className="text-xl font-serif text-green-600">Secure & Online</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

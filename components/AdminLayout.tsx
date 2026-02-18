import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/adminGuard';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    verify();
  }, [location.pathname]);

  const verify = async () => {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin && location.pathname !== '/admin') {
      navigate('/admin');
      return;
    }
    setIsAuthorized(isAdmin);
    setLoading(false);
  };

  const navItems = [
    { name: 'Command Center', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Enquiries', path: '/admin/leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Site Content', path: '/admin/content', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Branding', path: '/admin/branding', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.486L11 21V7.343z' },
    { name: 'Media Vault', path: '/admin/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  if (!isAuthorized && location.pathname !== '/admin') return null;
  if (!isAuthorized) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-forest text-white flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#c5a059] rounded-xl flex items-center justify-center font-serif text-lg font-bold shadow-lg group-hover:rotate-6 transition-transform">W</div>
            <div>
              <h1 className="text-sm font-serif font-bold tracking-widest leading-none">WOOD HEAVEN</h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#c5a059] font-black mt-1">Operations</p>
            </div>
          </Link>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'bg-[#c5a059] text-white shadow-xl translate-x-2' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/');
            }}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Terminate
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow ml-72">
        <header className="h-20 bg-white border-b border-earth/5 px-10 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-earth/30">Jaipur Primary Node • Secure Gateway</p>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-forest border-b-2 border-forest pb-1 hover:text-[#c5a059] hover:border-[#c5a059] transition-all">View Live Site</Link>
            <div className="flex items-center gap-3 bg-beige/50 px-4 py-2 rounded-full border border-earth/5">
              <div className="w-6 h-6 bg-forest rounded-full flex items-center justify-center text-[8px] text-white font-black">AD</div>
              <span className="text-[10px] font-black text-forest">ADMINISTRATOR</span>
            </div>
          </div>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

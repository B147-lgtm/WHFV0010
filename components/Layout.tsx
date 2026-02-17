import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_ASSETS } from '../constants';
import { supabase } from '../lib/supabase';

const Navbar = ({ settings }: { settings: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setIsAdmin(!!session);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Stay', path: '/stay' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const brandName = settings?.brand_name || 'WOOD HEAVEN';
  const logo = settings?.logo_url || BRAND_ASSETS.logo;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-forest/98 backdrop-blur-xl py-4 shadow-2xl border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-white font-serif text-2xl tracking-widest flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden border-2 border-[#c5a059] rounded-full shadow-lg bg-forest">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<span class="text-[10px] text-[#c5a059] font-bold">WHF</span>';
                }
              }}
            />
          </div>
          <span className="hidden sm:inline-block leading-none">
            {(brandName || '').toUpperCase()}
            <span className="block text-[10px] tracking-[0.6em] font-inter opacity-60">FARMS</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${location.pathname === link.path ? 'text-[#c5a059] font-bold' : 'text-white/80 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-[11px] uppercase tracking-[0.2em] text-[#c5a059] hover:text-white transition-colors border border-[#c5a059]/30 px-3 py-1 rounded">
              Admin
            </Link>
          )}
          <Link to="/stay" className="bg-[#c5a059] text-white px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-forest transition-all shadow-xl">
            Book Now
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-forest border-t border-white/10 py-10 px-6 flex flex-col gap-8 items-center shadow-2xl"
          >
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="text-white text-xl font-serif tracking-widest"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="text-[#c5a059] text-xl font-serif tracking-widest">
                Admin Portal
              </Link>
            )}
            <Link 
              to="/stay" 
              onClick={() => setIsOpen(false)}
              className="bg-[#c5a059] text-white w-full text-center py-4 rounded-full font-bold uppercase tracking-widest"
            >
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({ settings }: { settings: any }) => {
  const brandName = settings?.brand_name || 'Wood Heaven Farms';
  const whatsapp = settings?.whatsapp_number || '918852021119';
  const phone = settings?.phone_number || '+91 88520 21119';
  const email = settings?.email_address || 'woodheavenfarms@gmail.com';
  const logo = settings?.logo_url || BRAND_ASSETS.logo;
  const address = settings?.address_text || '631,632, green triveni, Opp. ashiana greens, sikar road, Jaipur - 302013';

  return (
    <footer className="bg-forest text-white py-24 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <img src={logo} alt="" className="w-16 h-16 object-contain rounded-full border border-white/20 bg-forest p-1" />
            <div>
              <h2 className="text-3xl font-serif leading-none mb-1">{brandName}</h2>
              <p className="text-[#c5a059] text-[10px] tracking-[0.4em] uppercase">Premium Luxury Living</p>
            </div>
          </div>
          <p className="text-white/60 max-w-md mb-10 leading-relaxed text-sm">
            Discover a sanctuary of elegance. From corporate retreats to grand weddings, Wood Heaven Farms provides the perfect backdrop for life's most cherished moments.
          </p>
          <div className="flex gap-4">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#c5a059] hover:border-[#c5a059] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-[#c5a059]">Quick Links</h4>
          <div className="flex flex-col gap-4 text-white/50 text-sm">
            <Link to="/stay" className="hover:text-white transition-colors">Book a Stay</Link>
            <Link to="/events" className="hover:text-white transition-colors">Plan an Event</Link>
            <Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Location</Link>
            <Link to="/admin" className="hover:text-[#c5a059] transition-colors">Admin Login</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-[#c5a059]">Contact Us</h4>
          <div className="flex flex-col gap-4 text-white/50 text-sm">
            <p>{address}</p>
            <p className="hover:text-white transition-colors cursor-pointer">{phone}</p>
            <p className="hover:text-white transition-colors cursor-pointer">{email}</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-24 pt-10 border-t border-white/5 text-center text-white/30 text-[9px] tracking-[0.3em] uppercase">
        © 2024 {brandName}. Curated for the Extraordinary.
      </div>
    </footer>
  );
};

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }: any) => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#c5a059] selection:text-white">
      <Navbar settings={settings} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={settings} />
      
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4">
        <motion.a 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`https://wa.me/${settings?.whatsapp_number || '918852021119'}?text=Hi, I'm interested in booking ${settings?.brand_name || 'Wood Heaven Farms'}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl transition-transform flex items-center justify-center"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </motion.a>
      </div>
    </div>
  );
};
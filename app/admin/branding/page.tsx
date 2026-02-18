import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { checkIsAdmin } from '../../../lib/adminGuard';
import { useNavigate } from 'react-router-dom';

export default function AdminBrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    brand_name: '',
    hero_title: '',
    hero_subtitle: '',
    tagline: '',
    logo_url: '',
    hero_image_url: '',
    section2_badge: '',
    section2_title: '',
    section2_subtitle: '',
    section2_image_url: '',
    whatsapp_number: '',
    phone_number: '',
    address_text: '',
    email_address: '',
    meta_description: '',
    meta_keywords: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    verifyAccess();
  }, [navigate]);

  const verifyAccess = async () => {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    fetchSettings();
  };

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (data) setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${field}-${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`; 
      
      const { error: uploadError } = await supabase.storage.from('branding').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('branding').getPublicUrl(filePath);
      setSettings((prev: any) => ({ ...prev, [field]: publicUrl }));
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({ ...settings, updated_at: new Date().toISOString() });
      if (error) throw error;
      alert('Vault configuration updated.');
    } catch (err: any) {
      alert('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-24 text-center font-serif text-3xl text-forest animate-pulse">Syncing Configuration...</div>;

  return (
    <div className="pt-24 min-h-screen bg-beige p-8 selection:bg-forest selection:text-white">
      <div className="container mx-auto max-w-6xl">
        <form onSubmit={handleSave} className="bg-white rounded-[5rem] shadow-2xl p-16 border border-white/50 relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-20 gap-12 relative z-10">
            <div>
              <h1 className="text-5xl font-serif text-forest mb-4 tracking-tight">Identity & Vision</h1>
              <p className="text-[11px] uppercase tracking-[0.5em] text-earth/40 font-black">Global Brand Architecture & Editorial Control</p>
            </div>
            <button disabled={saving} className="bg-forest text-white px-16 py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-[#c5a059] transition-all disabled:opacity-50 text-[11px]">
              {saving ? 'Syncing...' : 'Commit Changes'}
            </button>
          </div>

          <div className="space-y-24 relative z-10">
            {/* Brand Essence */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-serif text-forest mb-4 tracking-tight">1. Brand Essence</h3>
                <p className="text-earth/40 text-xs leading-relaxed font-bold uppercase tracking-wider">Define the core identity that appears on the navbar and across the site footer.</p>
              </div>
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Brand Name</label>
                    <input value={settings.brand_name} onChange={e => setSettings({...settings, brand_name: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm font-bold text-forest" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Established Tagline</label>
                    <input value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Brand Logo</label>
                  <div className="flex items-center gap-10">
                    <div className="w-24 h-24 bg-forest rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                      <img src={settings.logo_url} className="w-full h-full object-contain p-2" />
                    </div>
                    <label className="px-8 py-4 bg-beige text-forest border border-earth/5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-forest hover:text-white transition-all shadow-sm">
                      Upload Logo
                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'logo_url')} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-serif text-forest mb-4 tracking-tight">2. Hero Cinematic</h3>
                <p className="text-earth/40 text-xs leading-relaxed font-bold uppercase tracking-wider">The first visual interaction guests have with your sanctuary.</p>
              </div>
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Grand Title</label>
                    <input value={settings.hero_title} onChange={e => setSettings({...settings, hero_title: e.target.value})} className="w-full bg-beige/30 border-none rounded-3xl px-8 py-6 text-2xl font-serif text-forest" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Hero Narrative</label>
                    <textarea value={settings.hero_subtitle} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} className="w-full bg-beige/30 border-none rounded-3xl px-8 py-6 text-sm h-32 leading-relaxed" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Cinematic Background</label>
                    <div className="aspect-video bg-beige rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden group relative">
                      <img src={settings.hero_image_url || 'https://via.placeholder.com/1200x800'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <label className="absolute inset-0 bg-forest/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[11px] font-black uppercase tracking-[0.4em]">
                        Swap Background
                        <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'hero_image_url')} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Control (Section 2) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-beige pt-20">
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-serif text-forest mb-4 tracking-tight">3. Editorial Welcome</h3>
                <p className="text-earth/40 text-xs leading-relaxed font-bold uppercase tracking-wider">Customize the narrative of the secondary section on the home page.</p>
              </div>
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Section Badge</label>
                    <input value={settings.section2_badge} onChange={e => setSettings({...settings, section2_badge: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm" placeholder="Guest Favourite" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Editorial Title</label>
                    <input value={settings.section2_title} onChange={e => setSettings({...settings, section2_title: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm font-serif" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Detailed Narrative</label>
                  <textarea value={settings.section2_subtitle} onChange={e => setSettings({...settings, section2_subtitle: e.target.value})} className="w-full bg-beige/30 border-none rounded-3xl px-8 py-6 text-sm h-40 leading-relaxed" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Editorial Image</label>
                  <div className="aspect-[4/5] bg-beige rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden group relative max-w-sm">
                    <img src={settings.section2_image_url || 'https://via.placeholder.com/800x1000'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <label className="absolute inset-0 bg-forest/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[11px] font-black uppercase tracking-[0.4em]">
                      Update Image
                      <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'section2_image_url')} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Nodes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-beige pt-20">
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-serif text-forest mb-4 tracking-tight">4. Contact Channels</h3>
                <p className="text-earth/40 text-xs leading-relaxed font-bold uppercase tracking-wider">Manage how guests reach out to your sanctuary concierge.</p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">WhatsApp Gateway (Digits)</label>
                  <input value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Display Phone Number</label>
                  <input value={settings.phone_number} onChange={e => setSettings({...settings, phone_number: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Concierge Email</label>
                  <input value={settings.email_address} onChange={e => setSettings({...settings, email_address: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Physical Location Address</label>
                  <input value={settings.address_text} onChange={e => setSettings({...settings, address_text: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm" />
                </div>
              </div>
            </div>

            {/* Search Engine Presence */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-beige pt-20">
              <div className="lg:col-span-1">
                <h3 className="text-2xl font-serif text-forest mb-4 tracking-tight">5. Search Architecture</h3>
                <p className="text-earth/40 text-xs leading-relaxed font-bold uppercase tracking-wider">Control how search engines interpret your sanctuary.</p>
              </div>
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Meta Description</label>
                  <textarea value={settings.meta_description} onChange={e => setSettings({...settings, meta_description: e.target.value})} className="w-full bg-beige/30 border-none rounded-3xl px-8 py-6 text-sm h-32 leading-relaxed" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-black text-earth/40 ml-2">Global Keywords (Comma separated)</label>
                  <input value={settings.meta_keywords} onChange={e => setSettings({...settings, meta_keywords: e.target.value})} className="w-full bg-beige/30 border-none rounded-2xl px-8 py-5 text-sm" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

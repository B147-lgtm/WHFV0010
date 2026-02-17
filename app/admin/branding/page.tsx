import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { checkIsAdmin } from '../../../lib/adminGuard';
import { useNavigate } from 'react-router-dom';

export default function AdminBrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    brand_name: 'Wood Heaven Farms',
    hero_title: 'Welcome to Heaven',
    hero_subtitle: 'A sanctuary of elegance and luxury.',
    tagline: 'Estd. 2024 • Luxury Farmhouse',
    logo_url: '',
    hero_image_url: '',
    brochure_url: '',
    whatsapp_number: '918852021119',
    phone_number: '+91 88520 21119',
    address_text: '631,632, green triveni, Opp. ashiana greens, sikar road, Jaipur - 302013',
    instagram_url: '',
    airbnb_url: '',
    booking_url: '',
    email_address: 'woodheavenfarms@gmail.com'
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
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('updated_at', { ascending: false })
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
      const filePath = `assets/${fileName}`; 
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
      const payload = { ...settings, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('site_settings').upsert(payload);
      
      if (error) throw error;
      alert('Success: Site settings updated.');
      fetchSettings();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-serif text-2xl text-forest">Accessing configuration...</div>;

  return (
    <div className="pt-24 min-h-screen bg-beige p-6">
      <div className="container mx-auto max-w-5xl">
        <form onSubmit={handleSave} className="bg-white rounded-[4rem] shadow-2xl p-12 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
            <div>
              <h1 className="text-4xl font-serif text-forest mb-2">Site Configuration</h1>
              <p className="text-[10px] uppercase tracking-widest text-earth/40 font-bold">Manage branding, assets, and contact details</p>
            </div>
            <button disabled={saving} className="bg-forest text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-[#c5a059] transition-all disabled:opacity-50">
              {saving ? 'Synchronizing...' : 'Save All Changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div className="bg-beige/30 p-8 rounded-[2rem] border border-white">
                <h3 className="text-xl font-serif text-forest mb-6">Core Identity</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Brand Name</label>
                    <input value={settings.brand_name} onChange={e => setSettings({...settings, brand_name: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Tagline</label>
                    <input value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                  </div>
                </div>
              </div>

              <div className="bg-beige/30 p-8 rounded-[2rem] border border-white">
                <h3 className="text-xl font-serif text-forest mb-6">Hero Banner</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Hero Title</label>
                    <input value={settings.hero_title} onChange={e => setSettings({...settings, hero_title: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm font-serif" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Hero Subtitle</label>
                    <textarea value={settings.hero_subtitle} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm h-32 leading-relaxed" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-beige/30 p-8 rounded-[2rem] border border-white">
                <h3 className="text-xl font-serif text-forest mb-6">Visual Assets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Brand Logo</label>
                    <div className="aspect-square bg-white rounded-3xl border border-earth/5 overflow-hidden flex items-center justify-center p-4 group relative">
                      <img src={settings.logo_url || 'https://via.placeholder.com/200?text=Logo'} className="max-w-full max-h-full object-contain" />
                      <label className="absolute inset-0 bg-forest/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold uppercase tracking-widest">
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'logo_url')} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Hero Image</label>
                    <div className="aspect-square bg-white rounded-3xl border border-earth/5 overflow-hidden flex items-center justify-center group relative">
                      <img src={settings.hero_image_url || 'https://via.placeholder.com/600x400?text=Hero'} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-forest/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold uppercase tracking-widest text-center px-4">
                        Change Image
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'hero_image_url')} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-beige/30 p-8 rounded-[2rem] border border-white">
                <h3 className="text-xl font-serif text-forest mb-6">External Listings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Airbnb URL</label>
                    <input value={settings.airbnb_url || ''} onChange={e => setSettings({...settings, airbnb_url: e.target.value})} placeholder="https://www.airbnb.com/rooms/..." className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Booking.com URL</label>
                    <input value={settings.booking_url || ''} onChange={e => setSettings({...settings, booking_url: e.target.value})} placeholder="https://www.booking.com/hotel/..." className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Instagram URL</label>
                    <input value={settings.instagram_url || ''} onChange={e => setSettings({...settings, instagram_url: e.target.value})} placeholder="https://instagram.com/..." className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                  </div>
                </div>
              </div>

              <div className="bg-beige/30 p-8 rounded-[2rem] border border-white">
                <h3 className="text-xl font-serif text-forest mb-6">Contact Details</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">WhatsApp</label>
                      <input value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Phone Display</label>
                      <input value={settings.phone_number} onChange={e => setSettings({...settings, phone_number: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Email Address</label>
                    <input value={settings.email_address} onChange={e => setSettings({...settings, email_address: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-earth/40">Address Text</label>
                    <input value={settings.address_text} onChange={e => setSettings({...settings, address_text: e.target.value})} className="w-full bg-white border-none rounded-2xl px-6 py-4 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { checkIsAdmin } from '../../../lib/adminGuard';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Rooms', 'Pool', 'Lawn', 'Night Vibes', 'Bar Garden'];

interface UploadJob {
  id: string;
  file: File;
  title: string;
  category: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export default function AdminGalleryPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [globalCategory, setGlobalCategory] = useState('Rooms');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    verifyAccess();
  }, [navigate]);

  const verifyAccess = async () => {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      navigate('/admin');
    } else {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newJobs: UploadJob[] = Array.from(e.target.files).map((file: File) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      title: file.name.split('.')[0],
      category: globalCategory,
      progress: 0,
      status: 'pending'
    }));
    setJobs(prev => [...prev, ...newJobs]);
  };

  const uploadFile = async (job: UploadJob) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'uploading' } : j));

    try {
      const fileExt = job.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, job.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{
          title: job.title,
          category: job.category,
          storage_path: filePath,
          url: publicUrl
        }]);

      if (dbError) throw dbError;

      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'completed', progress: 100 } : j));
    } catch (err: any) {
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'error', error: err.message } : j));
    }
  };

  const startAll = () => {
    jobs.filter(j => j.status === 'pending').forEach(uploadFile);
  };

  if (loading) return null;

  return (
    <div className="pt-24 min-h-screen bg-beige p-6">
      <div className="container mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl p-10 mb-8">
          <h1 className="text-4xl font-serif text-forest mb-8">Gallery Manager</h1>
          
          <div className="flex flex-wrap gap-6 items-center mb-10">
            <select 
              value={globalCategory} 
              onChange={e => setGlobalCategory(e.target.value)}
              className="bg-beige border-none rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-widest text-forest"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-forest text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Select Images
            </button>
            <button 
              onClick={startAll}
              className="bg-[#c5a059] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              Upload All
            </button>
            <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="flex items-center gap-6 p-4 bg-beige/50 rounded-2xl border border-white">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm">
                  <img src={URL.createObjectURL(job.file)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-sm text-forest">{job.title}</p>
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${job.status === 'completed' ? 'text-green-600' : 'text-earth/40'}`}>{job.status}</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${job.status === 'error' ? 'bg-red-500' : 'bg-forest'}`} style={{ width: `${job.status === 'completed' ? 100 : job.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

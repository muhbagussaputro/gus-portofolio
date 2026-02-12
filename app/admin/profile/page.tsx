'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/app/(home)/Layout';
import { Save } from 'lucide-react';
import { Profile } from '@/types/database';
import { useToast } from '@/components/Toast';

export default function ProfileAdminPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState<Partial<Profile>>({
    full_name: '',
    headline: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    hero_strings: ['Full Stack Developer', 'Mobile Developer'],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data?.data) setForm(data.data);
    };
    load();
  }, []);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!form.full_name?.trim()) errors.push('Full name is required');
    if (!form.headline?.trim()) errors.push('Headline is required');
    if (!form.email?.trim()) errors.push('Email is required');
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.push('Valid email is required');
    }
    
    return errors;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showToast({ 
        type: 'error', 
        title: 'Validation Error',
        message: validationErrors.join(', ')
      });
      return;
    }
    
    setLoading(true);
    try {
      const method = form.id ? 'PATCH' : 'POST';
      const res = await fetch('/api/profile', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        showToast({ 
          type: 'success', 
          title: 'Profile saved successfully!'
        });
      } else {
        showToast({ 
          type: 'error', 
          title: 'Failed to save profile'
        });
      }
    } catch (error) {
      showToast({ 
        type: 'error', 
        title: 'Failed to save profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Kelola Profile</h1>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Nama Lengkap" value={form.full_name || ''} onChange={(v) => setForm((p) => ({ ...p, full_name: v }))} required />
            <Input label="Headline" value={form.headline || ''} onChange={(v) => setForm((p) => ({ ...p, headline: v }))} />
            <Textarea label="Ringkasan" value={form.summary || ''} onChange={(v) => setForm((p) => ({ ...p, summary: v }))} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" value={form.email || ''} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
              <Input label="Phone" value={form.phone || ''} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
              <Input label="Location" value={form.location || ''} onChange={(v) => setForm((p) => ({ ...p, location: v }))} />
              <Input label="GitHub URL" value={form.github_url || ''} onChange={(v) => setForm((p) => ({ ...p, github_url: v }))} />
              <Input label="LinkedIn URL" value={form.linkedin_url || ''} onChange={(v) => setForm((p) => ({ ...p, linkedin_url: v }))} />
              <Input label="Twitter URL" value={form.twitter_url || ''} onChange={(v) => setForm((p) => ({ ...p, twitter_url: v }))} />
              <Input label="Website" value={form.website_url || ''} onChange={(v) => setForm((p) => ({ ...p, website_url: v }))} />
            </div>
            <Textarea
              label="Hero Strings (pisah baris)"
              value={(form.hero_strings || []).join('\n')}
              onChange={(v) => setForm((p) => ({ ...p, hero_strings: v.split('\n').filter(Boolean) }))}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg"
            >
              <Save size={18} className="mr-2" /> {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

function Input({ label, value, onChange, required = false }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-white font-medium mb-2">{label}</label>
      <input
        required={required}
        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-white font-medium mb-2">{label}</label>
      <textarea
        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}



import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, MapPin, Send, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SiteSettings } from '@/types/adminTypes';
import { Skeleton } from '@/components/ui/skeleton';

const defaultSettings = {
  email: 'contact@dotgov-technologies.example',
  phone: '',
  address: 'Global Operations',
  linkedin_url: 'DotGov Technologies'
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', org: '', email: '', msg: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'contact')
        .maybeSingle();
      if (error) throw error;

      if (data) setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.msg) {
      setLoading(true);
      try {
        await supabase.from('contact_submissions').insert([{
          name: form.name, organization: form.org, email: form.email, message: form.msg, status: 'new'
        }]);
        setSubmitted(true);
        setForm({ name: '', org: '', email: '', msg: '' });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">Contact</div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-6">Let's talk about your digital government agenda.</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-6">Share a brief description of your current initiatives, and our team will get back to you.</p>
            {settingsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-36" />
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                {settings.email && <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-[#00C2D1]" /><span>{settings.email}</span></div>}
                {settings.phone && <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-[#00C2D1]" /><span>{settings.phone}</span></div>}
                {settings.linkedin_url && <div className="flex items-center gap-3"><Linkedin className="w-5 h-5 text-[#00C2D1]" /><span>{settings.linkedin_url}</span></div>}
                {settings.address && <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#00C2D1]" /><span>{settings.address}</span></div>}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            {submitted ? (
              <div className="text-center py-8"><div className="text-[#00C2D1] text-xl font-semibold mb-2">Thank you!</div><p className="text-gray-600">We'll be in touch soon.</p></div>
            ) : (
              <>
                <div><label className="block text-sm mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Full name" required /></div>
                <div><label className="block text-sm mb-1">Organisation</label><input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Ministry / Agency" /></div>
                <div><label className="block text-sm mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="email@example.com" required /></div>
                <div><label className="block text-sm mb-1">Message</label><textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm h-28" placeholder="Describe your project..." required /></div>
                <button type="submit" disabled={loading} className="bg-[#003B8E] text-white px-6 py-2 rounded-full font-medium hover:bg-[#002d6d] transition flex items-center gap-2 disabled:opacity-50">
                  <Send className="w-4 h-4" />{loading ? 'Sending...' : 'Send message'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSettings {
  title?: string;
  subtitle?: string;
  description?: string;
}

const defaultSettings: HeroSettings = {
  title: 'Engineering Digital Government.',
  subtitle: 'GovTech · AI · Public Services',
  description: 'DotGov Technologies designs and operates secure, interoperable and AI-powered platforms that help governments deliver fast, transparent and citizen-centric services.',
};

const focusAreas = [
  'Government Service Bus & National Data Exchange',
  'Digital Identity & Trust Services',
  'ePayments & Digital Revenue Collection',
  'AI Analytics & Decision Support for Public Sector',
];

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'hero')
        .maybeSingle();
      if (error) throw error;

      if (data) setSettings({ ...defaultSettings, ...data });
    } catch (err) {
      console.error('Error fetching hero settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-br from-[#00C2D1] to-[#003B8E] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-3">
          {loading ? (
            <>
              <Skeleton className="h-4 w-48 mb-3 bg-white/20" />
              <Skeleton className="h-12 w-full mb-4 bg-white/20" />
              <Skeleton className="h-20 w-full mb-6 bg-white/20" />
            </>
          ) : (
            <>
              <div className="uppercase tracking-widest text-xs opacity-90 mb-3">{settings.subtitle}</div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{settings.title}</h1>
              <p className="text-lg opacity-90 max-w-xl mb-6">{settings.description}</p>
            </>
          )}
          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo('#solutions')} className="bg-white text-[#003B8E] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
              Explore Solutions
            </button>
            <button className="border border-white/60 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition">
              Download Company Profile
            </button>
          </div>
        </div>
        <aside className="md:col-span-2 bg-white/10 border border-white/30 rounded-2xl p-6">
          <div className="uppercase tracking-widest text-sm opacity-90 mb-4">Key Focus Areas</div>
          <ul className="space-y-2 text-sm">
            {focusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#00C2D1]">•</span> {area}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

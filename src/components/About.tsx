import React, { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AboutValue } from '@/types/adminTypes';
import { getIcon } from '@/lib/iconMap';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionSettings { title?: string; subtitle?: string; description?: string; }

const defaultSection: SectionSettings = {
  title: 'About DotGov Technologies.',
  subtitle: 'About',
  description: 'DotGov Technologies is a specialised GovTech company focused on designing, building and operating digital public service platforms.',
};

const fallbackValues = [
  { icon: 'Target', title: 'Mission-Driven', description: 'Focused on delivering measurable impact for public institutions.' },
  { icon: 'Users', title: 'Citizen-Centric', description: 'Designing services that put citizens and businesses first.' },
  { icon: 'Lightbulb', title: 'Innovation', description: 'Leveraging emerging technologies responsibly for public good.' },
  { icon: 'Globe', title: 'Sustainability', description: 'Building platforms that scale and endure over time.' },
];

export default function About() {
  const [values, setValues] = useState<AboutValue[]>([]);
  const [section, setSection] = useState<SectionSettings>(defaultSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [valuesRes, settingsRes] = await Promise.all([
        supabase.from('about_values').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_settings').select('*').eq('section', 'about').maybeSingle()
      ]);

      if (valuesRes.data) setValues(valuesRes.data);
      if (settingsRes.data) setSection({ ...defaultSection, ...settingsRes.data });
    } catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  const displayData = values.length === 0 ? fallbackValues : values;

  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-16">
      <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">{section.subtitle}</div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-4">{section.title}</h2>
      <p className="text-gray-600 max-w-3xl mb-8">{section.description}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm text-center"><Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" /><Skeleton className="h-5 w-24 mx-auto mb-2" /><Skeleton className="h-12 w-full" /></div>
        )) : displayData.map((v, i) => {
          const IconComponent = getIcon(v.icon, Target);
          return (
            <div key={v.id || i} className="bg-white rounded-xl p-5 shadow-sm text-center hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#e3f6f8] rounded-full flex items-center justify-center mx-auto mb-3">
                <IconComponent className="w-6 h-6 text-[#003B8E]" />
              </div>
              <h3 className="font-semibold text-[#003B8E] mb-1">{v.title}</h3>
              <p className="text-sm text-gray-600">{v.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

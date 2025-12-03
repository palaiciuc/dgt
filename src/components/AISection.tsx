import React, { useEffect, useState } from 'react';
import { FileSearch } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AIFeature } from '@/types/adminTypes';
import { getIcon } from '@/lib/iconMap';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionSettings { title?: string; subtitle?: string; description?: string; }

const defaultSection: SectionSettings = {
  title: 'AI that augments public sector decision-making.',
  subtitle: 'AI for Government',
  description: 'We combine domain expertise with AI capabilities to automate repetitive work and provide better insight.',
};

const fallbackFeatures = [
  { icon: 'FileSearch', title: 'Document Intelligence', description: 'OCR and NLP pipelines that extract data from forms, certificates and legacy documents.' },
  { icon: 'AlertTriangle', title: 'Risk & Fraud Scoring', description: 'AI models that identify anomalies and risk patterns in transactions and applications.' },
  { icon: 'LineChart', title: 'Decision Support', description: 'Scenario modelling, forecasting and dashboards that support policy makers.' },
];

export default function AISection() {
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [section, setSection] = useState<SectionSettings>(defaultSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [featuresRes, settingsRes] = await Promise.all([
        supabase.from('ai_features').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_settings').select('*').eq('section', 'ai').maybeSingle()
      ]);

      if (featuresRes.data) setFeatures(featuresRes.data);
      if (settingsRes.data) setSection({ ...defaultSection, ...settingsRes.data });
    } catch (err) { console.error('Error:', err); }
    finally { setLoading(false); }
  };

  const displayData = features.length === 0 ? fallbackFeatures : features;

  return (
    <section id="ai" className="max-w-6xl mx-auto px-6 py-16">
      <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">{section.subtitle}</div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-2">{section.title}</h2>
      <p className="text-gray-600 max-w-2xl mb-8">{section.description}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm"><Skeleton className="h-12 w-12 rounded-lg mb-4" /><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-16 w-full" /></div>
        )) : displayData.map((f, i) => {
          const IconComponent = getIcon(f.icon, FileSearch);
          return (
            <article key={f.id || i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00C2D1] to-[#003B8E] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#003B8E] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Solution } from '@/types/adminTypes';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionSettings {
  title?: string;
  subtitle?: string;
  description?: string;
}

const defaultSection: SectionSettings = {
  title: 'Digital solutions for modern public administrations.',
  subtitle: 'Solutions',
  description: 'From data exchange to payments and citizen-facing portals, our solutions cover the full lifecycle of digital public services.',
};

const fallbackSolutions = [
  { tag: 'Integration', title: 'Government Service Bus (GSB)', description: 'Secure, scalable and policy-driven platform for data exchange between government systems.' },
  { tag: 'Data', title: 'National Data Registers', description: 'Design and implementation of master data registers with clear governance and APIs.' },
  { tag: 'Identity', title: 'Digital Identity & Trust Services', description: 'eID, authentication, digital signatures and trust services for secure access.' },
  { tag: 'Payments', title: 'ePayments & Revenue Collection', description: 'Platforms for collecting government fees, fines and taxes through multiple channels.' },
  { tag: 'Portals', title: 'Citizen & Business Portals', description: 'Unified access to public services through responsive web and mobile channels.' },
  { tag: 'Operations', title: 'Back-office & Workflow', description: 'Configurable workflows and case management across institutions.' },
];

export default function Solutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [section, setSection] = useState<SectionSettings>(defaultSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [solutionsRes, settingsRes] = await Promise.all([
        supabase.from('solutions').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_settings').select('*').eq('section', 'solutions').maybeSingle()
      ]);

      if (solutionsRes.data) setSolutions(solutionsRes.data);
      if (settingsRes.data) setSection({ ...defaultSection, ...settingsRes.data });
    } catch (err) {
      console.error('Error fetching solutions:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayData = solutions.length === 0 ? fallbackSolutions : solutions;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-16">
      <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">{section.subtitle}</div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-2">{section.title}</h2>
      <p className="text-gray-600 max-w-2xl mb-8">{section.description}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))
        ) : (
          displayData.map((s, i) => (
            <article key={s.id || i} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer">
              <span className="text-xs uppercase tracking-wider text-gray-500">{s.tag}</span>
              <h3 className="font-semibold text-[#003B8E] mt-1 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.description}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

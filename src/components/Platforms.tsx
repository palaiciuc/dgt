import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Platform } from '@/types/adminTypes';
import { getIcon } from '@/lib/iconMap';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionSettings {
  title?: string;
  subtitle?: string;
  description?: string;
}

const defaultSection: SectionSettings = {
  title: 'Government-as-a-Platform architecture.',
  subtitle: 'Platforms',
  description: 'Our platforms are built as reusable building blocks that accelerate the rollout of new services.',
};

const fallbackPlatforms = [
  { icon: 'Layers', title: 'Integration Platform', description: 'Service bus, API gateway, routing, transformation and monitoring for all inter-agency traffic.' },
  { icon: 'Smartphone', title: 'Digital Channels Platform', description: 'Components for authentication, user profiles, notifications and service catalogues across web and mobile.' },
  { icon: 'BarChart3', title: 'Data & Analytics Platform', description: 'Data lake, analytics workspaces and AI engines that support policy design and operational dashboards.' },
];

export default function Platforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [section, setSection] = useState<SectionSettings>(defaultSection);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [platformsRes, settingsRes] = await Promise.all([
        supabase.from('platforms').select('*').eq('is_active', true).order('display_order'),
        supabase.from('site_settings').select('*').eq('section', 'platforms').maybeSingle()
      ]);

      if (platformsRes.data) setPlatforms(platformsRes.data);
      if (settingsRes.data) setSection({ ...defaultSection, ...settingsRes.data });
    } catch (err) {
      console.error('Error fetching platforms:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayData = platforms.length === 0 ? fallbackPlatforms : platforms;

  return (
    <section id="platforms" className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="uppercase tracking-widest text-xs text-gray-500 mb-2">{section.subtitle}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#003B8E] mb-2">{section.title}</h2>
        <p className="text-gray-600 max-w-2xl mb-8">{section.description}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))
          ) : (
            displayData.map((p, i) => {
              const IconComponent = getIcon(p.icon, Layers);
              return (
                <article key={p.id || i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <IconComponent className="w-10 h-10 text-[#00C2D1] mb-4" />
                  <h3 className="font-semibold text-[#003B8E] mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

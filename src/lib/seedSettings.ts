import { supabase } from '@/lib/supabase';

export const defaultSettings = [
  {
    section: 'hero',
    title: 'Engineering Digital Government.',
    subtitle: 'GovTech · AI · Public Services',
    description: 'DotGov Technologies designs and operates secure, interoperable and AI-powered platforms that help governments deliver fast, transparent and citizen-centric services.'
  },
  {
    section: 'solutions',
    title: 'Digital solutions for modern public administrations.',
    subtitle: 'Solutions',
    description: 'From data exchange to payments and citizen-facing portals, our solutions cover the full lifecycle of digital public services.'
  },
  {
    section: 'platforms',
    title: 'Government-as-a-Platform architecture.',
    subtitle: 'Platforms',
    description: 'Our platforms are built as reusable building blocks that accelerate the rollout of new services.'
  },
  {
    section: 'ai',
    title: 'AI that augments public sector decision-making.',
    subtitle: 'AI for Government',
    description: 'We combine domain expertise with AI capabilities to automate repetitive work and provide better insight.'
  },
  {
    section: 'about',
    title: 'About DotGov Technologies.',
    subtitle: 'About',
    description: 'DotGov Technologies is a specialised GovTech company focused on designing, building and operating digital public service platforms.'
  },
  {
    section: 'contact',
    title: "Let's talk about your digital government agenda.",
    subtitle: 'Contact',
    description: 'Share a brief description of your current initiatives, and our team will get back to you.',
    email: 'contact@dotgov-technologies.example',
    phone: '+1 (555) 123-4567',
    address: 'Global Operations',
    linkedin_url: 'DotGov Technologies'
  }
];

export interface SeedResult {
  section: string;
  status: 'created' | 'skipped' | 'updated' | 'error';
  error?: string;
}

export async function seedSettings(force = false): Promise<SeedResult[]> {
  const results: SeedResult[] = [];

  for (const setting of defaultSettings) {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('section', setting.section)
      .maybeSingle();

    if (existing && !force) {
      results.push({ section: setting.section, status: 'skipped' });
      continue;
    }

    const payload = { ...setting, updated_at: new Date().toISOString() };

    if (existing) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', existing.id);
      results.push({ section: setting.section, status: error ? 'error' : 'updated', error: error?.message });
    } else {
      const { error } = await supabase.from('site_settings').insert([payload]);
      results.push({ section: setting.section, status: error ? 'error' : 'created', error: error?.message });
    }
  }

  return results;
}

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { seedAllContent, getSeedSummary } from '@/lib/seedContentUtils';
import { seedAllMedia, getMediaSeedSummary } from '@/lib/seedMediaUtils';
import { linkAllMedia, getLinkSummary } from '@/lib/linkMediaMain';
import { useToast } from '@/hooks/use-toast';
import { FileText, MessageSquare, Lightbulb, Layers, Brain, Info, Database, RefreshCw, Loader2, Image, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({ caseStudies: 0, solutions: 0, platforms: 0, aiFeatures: 0, aboutValues: 0, submissions: 0 });
  const [seeding, setSeeding] = useState(false);
  const [seedingMedia, setSeedingMedia] = useState(false);
  const [linking, setLinking] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchCounts(); }, []);

  const fetchCounts = async () => {
    const [cs, sol, plat, ai, about, sub] = await Promise.all([
      supabase.from('case_studies').select('*', { count: 'exact', head: true }),
      supabase.from('solutions').select('*', { count: 'exact', head: true }),
      supabase.from('platforms').select('*', { count: 'exact', head: true }),
      supabase.from('ai_features').select('*', { count: 'exact', head: true }),
      supabase.from('about_values').select('*', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    ]);
    setCounts({ caseStudies: cs.count || 0, solutions: sol.count || 0, platforms: plat.count || 0, aiFeatures: ai.count || 0, aboutValues: about.count || 0, submissions: sub.count || 0 });
  };

  const handleSeedContent = async (force = false) => {
    setSeeding(true);
    try {
      const results = await seedAllContent(force);
      const summary = getSeedSummary(results);
      toast({ title: summary.success ? 'Success' : 'Error', description: summary.message, variant: summary.success ? 'default' : 'destructive' });
      fetchCounts();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSeeding(false);
  };

  const handleSeedMedia = async (force = false) => {
    setSeedingMedia(true);
    try {
      const results = await seedAllMedia(force);
      const summary = getMediaSeedSummary(results);
      toast({ title: summary.success ? 'Media Seeded' : 'Media Errors', description: summary.message, variant: summary.success ? 'default' : 'destructive' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSeedingMedia(false);
  };

  const handleLinkMedia = async () => {
    setLinking(true);
    try {
      const results = await linkAllMedia();
      const summary = getLinkSummary(results);
      toast({ title: summary.success ? 'Media Linked' : 'Linking Errors', description: summary.message, variant: summary.success ? 'default' : 'destructive' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setLinking(false);
  };

  const handleSeedAll = async (force = false) => {
    setSeeding(true); setSeedingMedia(true); setLinking(true);
    try {
      await seedAllContent(force);
      await seedAllMedia(force);
      const linkResults = await linkAllMedia();
      const linkSummary = getLinkSummary(linkResults);
      toast({ title: 'Complete Setup Done', description: `Content seeded, media uploaded, and ${linkSummary.message}` });
      fetchCounts();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSeeding(false); setSeedingMedia(false); setLinking(false);
  };

  const statCards = [
    { label: 'Case Studies', value: counts.caseStudies, icon: FileText, color: 'bg-purple-500', link: '/admin/case-studies' },
    { label: 'Solutions', value: counts.solutions, icon: Lightbulb, color: 'bg-blue-500', link: '/admin/solutions' },
    { label: 'Platforms', value: counts.platforms, icon: Layers, color: 'bg-green-500', link: '/admin/platforms' },
    { label: 'AI Features', value: counts.aiFeatures, icon: Brain, color: 'bg-cyan-500', link: '/admin/ai-features' },
    { label: 'About Values', value: counts.aboutValues, icon: Info, color: 'bg-indigo-500', link: '/admin/about' },
    { label: 'Submissions', value: counts.submissions, icon: MessageSquare, color: 'bg-orange-500', link: '/admin/submissions' },
  ];

  const isLoading = seeding || seedingMedia || linking;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleSeedAll(false)} disabled={isLoading} className="bg-gradient-to-r from-[#003B8E] to-[#00C2D1]">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
            Seed All Content
          </Button>
          <Button onClick={handleLinkMedia} disabled={isLoading} className="bg-violet-600 hover:bg-violet-700">
            {linking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Link2 className="w-4 h-4 mr-2" />}
            Link Media
          </Button>
          <Button onClick={() => handleSeedAll(true)} disabled={isLoading} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />Reset All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <a key={stat.label} href={stat.link} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className={`${stat.color} p-2 rounded-lg w-fit mb-2`}><stat.icon className="w-5 h-5 text-white" /></div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.label}</p>
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <SeedInfoCard title="Content Seeding" items={['Solutions: 6 items', 'Platforms: 4 items', 'AI Features: 4 items', 'About Values: 4 items']} color="blue" />
        <SeedInfoCard title="Media Seeding" items={['Hero: 2 banners', 'Solutions: 6 images', 'Platforms: 4 images', 'Team: 4 photos']} color="emerald" />
        <SeedInfoCard title="Media Linking" items={['Solutions → images', 'Platforms → images', 'AI Features → images', 'Case Studies → images']} color="violet" />
      </div>

      <QuickActions />
    </div>
  );
};

const SeedInfoCard = ({ title, items, color }: { title: string; items: string[]; color: string }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
    <div className="grid grid-cols-2 gap-2 text-sm">
      {items.map((item, i) => (
        <div key={i} className={`p-2 bg-${color}-50 rounded-lg text-${color}-700`}>{item}</div>
      ))}
    </div>
  </div>
);

const QuickActions = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { icon: FileText, title: 'Case Studies', desc: 'Add, edit or remove case studies', link: '/admin/case-studies' },
        { icon: Lightbulb, title: 'Solutions', desc: 'Manage solution offerings', link: '/admin/solutions' },
        { icon: Layers, title: 'Platforms', desc: 'Configure platform content', link: '/admin/platforms' },
        { icon: Brain, title: 'AI Features', desc: 'Update AI for Government section', link: '/admin/ai-features' },
        { icon: Info, title: 'About Values', desc: 'Edit company values', link: '/admin/about' },
        { icon: Image, title: 'Media Library', desc: 'Manage uploaded images', link: '/admin/media' },
      ].map((action) => (
        <a key={action.title} href={action.link} className="p-4 border border-gray-200 rounded-lg hover:border-[#00C2D1] hover:bg-[#00C2D1]/5 transition">
          <action.icon className="w-8 h-8 text-[#003B8E] mb-2" />
          <h3 className="font-semibold">{action.title}</h3>
          <p className="text-sm text-gray-500">{action.desc}</p>
        </a>
      ))}
    </div>
  </div>
);

export default AdminDashboard;

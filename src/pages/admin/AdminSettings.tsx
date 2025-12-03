import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Database, RefreshCw, Cloud } from 'lucide-react';
import SectionForm from '@/components/admin/SectionForm';
import ContactSettings from '@/components/admin/ContactSettings';
import CDNCachePanel from '@/components/admin/CDNCachePanel';
import { seedSettings } from '@/lib/seedSettings';

interface SectionSettings {
  id?: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin_url?: string;
}

const SECTIONS = ['hero', 'solutions', 'platforms', 'ai', 'about', 'contact', 'cache'];

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, SectionSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const mapped: Record<string, SectionSettings> = {};
      SECTIONS.forEach(s => { mapped[s] = { section: s }; });
      data?.forEach(item => { mapped[item.section] = item; });
      setSettings(mapped);
    }
    setLoading(false);
  };

  const updateField = (section: string, field: string, value: string) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const saveSection = async (section: string) => {
    setSaving(section);
    const data = settings[section];
    const payload = { ...data, section, updated_at: new Date().toISOString() };
    delete payload.id;

    let error;
    if (settings[section]?.id) {
      const res = await supabase.from('site_settings').update(payload).eq('id', settings[section].id);
      error = res.error;
    } else {
      const res = await supabase.from('site_settings').insert([payload]).select().single();
      error = res.error;
      if (res.data) setSettings(prev => ({ ...prev, [section]: res.data }));
    }

    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Saved', description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated` });
    setSaving(null);
  };

  const handleSeedSettings = async (force = false) => {
    setSeeding(true);
    const results = await seedSettings(force);
    const created = results.filter(r => r.status === 'created').length;
    const updated = results.filter(r => r.status === 'updated').length;
    const errors = results.filter(r => r.status === 'error');

    if (errors.length > 0) {
      toast({ title: 'Partial Success', description: `${errors.length} errors occurred`, variant: 'destructive' });
    } else if (created > 0 || updated > 0) {
      toast({ title: 'Success', description: `Created: ${created}, Updated: ${updated}` });
    } else {
      toast({ title: 'Info', description: 'All settings already exist' });
    }
    await fetchSettings();
    setSeeding(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#003B8E]" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSeedSettings(false)} disabled={seeding}>
            {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
            Seed Missing
          </Button>
          <Button variant="outline" onClick={() => handleSeedSettings(true)} disabled={seeding}>
            {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Reset All
          </Button>
        </div>
      </div>
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full max-w-3xl">
          {SECTIONS.map(s => (
            <TabsTrigger key={s} value={s} className="capitalize flex items-center gap-1">
              {s === 'cache' && <Cloud className="w-3 h-3" />}
              {s}
            </TabsTrigger>
          ))}
        </TabsList>
        {SECTIONS.map(section => (
          <TabsContent key={section} value={section}>
            {section === 'contact' ? (
              <ContactSettings settings={settings[section]} updateField={(f, v) => updateField(section, f, v)} onSave={() => saveSection(section)} saving={saving === section} />
            ) : section === 'cache' ? (
              <CDNCachePanel />
            ) : (
              <SectionForm section={section} settings={settings[section]} updateField={(f, v) => updateField(section, f, v)} onSave={() => saveSection(section)} saving={saving === section} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminSettings;

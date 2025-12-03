import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Loader2, Type, FileText } from 'lucide-react';

interface SectionSettings {
  title?: string;
  subtitle?: string;
  description?: string;
}

interface SectionFormProps {
  section: string;
  settings: SectionSettings;
  updateField: (field: string, value: string) => void;
  onSave: () => void;
  saving: boolean;
}

const sectionLabels: Record<string, { title: string; desc: string }> = {
  hero: { title: 'Hero Section', desc: 'Main banner headline and tagline' },
  solutions: { title: 'Solutions Section', desc: 'Solutions section title and intro text' },
  platforms: { title: 'Platforms Section', desc: 'Platforms section title and description' },
  ai: { title: 'AI for Government', desc: 'AI section title and description' },
  about: { title: 'About Section', desc: 'Company values section title and description' },
};

const SectionForm: React.FC<SectionFormProps> = ({ section, settings, updateField, onSave, saving }) => {
  const labels = sectionLabels[section] || { title: section, desc: '' };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5 text-[#003B8E]" />
          {labels.title}
        </CardTitle>
        <CardDescription>{labels.desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Section Title</label>
          <Input
            value={settings?.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder={`Enter ${section} section title`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle / Tagline</label>
          <Input
            value={settings?.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Enter subtitle or tagline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={settings?.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Enter section description"
            rows={4}
          />
        </div>
        <Button onClick={onSave} disabled={saving} className="bg-[#003B8E]">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default SectionForm;

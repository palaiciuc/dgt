import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Loader2, Mail, Phone, MapPin, Linkedin, Type } from 'lucide-react';

interface ContactSettingsData {
  title?: string;
  subtitle?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin_url?: string;
}

interface ContactSettingsProps {
  settings: ContactSettingsData;
  updateField: (field: string, value: string) => void;
  onSave: () => void;
  saving: boolean;
}

const ContactSettings: React.FC<ContactSettingsProps> = ({ settings, updateField, onSave, saving }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5 text-[#003B8E]" />
            Contact Section Content
          </CardTitle>
          <CardDescription>Section title and description text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <Input
              value={settings?.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Let's talk about your digital government agenda."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={settings?.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Share a brief description of your current initiatives..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#003B8E]" />
            Contact Information
          </CardTitle>
          <CardDescription>Company contact details displayed on the website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" /> Email Address
              </label>
              <Input
                type="email"
                value={settings?.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" /> Phone Number
              </label>
              <Input
                type="tel"
                value={settings?.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" /> Address
            </label>
            <Input
              value={settings?.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="123 Government Plaza, City, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-gray-500" /> LinkedIn URL
            </label>
            <Input
              value={settings?.linkedin_url || ''}
              onChange={(e) => updateField('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/company/your-company"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={onSave} disabled={saving} className="bg-[#003B8E]">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Contact Settings
      </Button>
    </div>
  );
};

export default ContactSettings;

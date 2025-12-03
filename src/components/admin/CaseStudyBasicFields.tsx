import React from 'react';
import { CaseStudyFormData } from '@/types/caseStudy';

interface Props {
  formData: CaseStudyFormData;
  errors: Record<string, string>;
  onChange: (field: keyof CaseStudyFormData, value: any) => void;
}

const CaseStudyBasicFields: React.FC<Props> = ({ formData, errors, onChange }) => {
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              onChange('title', e.target.value);
              if (!formData.slug) onChange('slug', generateSlug(e.target.value));
            }}
            className={`w-full p-3 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Case study title"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => onChange('slug', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="url-friendly-slug"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag *</label>
          <input
            type="text"
            value={formData.tag}
            onChange={(e) => onChange('tag', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.tag ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Digital Payments"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) => onChange('client', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.client ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Client name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
        <input
          type="text"
          value={formData.short_desc}
          onChange={(e) => onChange('short_desc', e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300"
          placeholder="Brief description for cards"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300"
          rows={2}
          placeholder="Detailed description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Overview *</label>
        <textarea
          value={formData.overview}
          onChange={(e) => onChange('overview', e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300"
          rows={3}
          placeholder="Project overview"
        />
      </div>
    </div>
  );
};

export default CaseStudyBasicFields;

import React from 'react';
import { CaseStudyFormData } from '@/types/caseStudy';

interface Props {
  formData: CaseStudyFormData;
  onChange: (field: keyof CaseStudyFormData, value: any) => void;
}

const TestimonialFields: React.FC<Props> = ({ formData, onChange }) => {
  const updateTestimonial = (field: string, value: string) => {
    onChange('testimonial', { ...formData.testimonial, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800 border-b pb-2">Testimonial</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
        <textarea
          value={formData.testimonial.quote}
          onChange={(e) => updateTestimonial('quote', e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300"
          rows={2}
          placeholder="Client testimonial quote"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
          <input
            type="text"
            value={formData.testimonial.author}
            onChange={(e) => updateTestimonial('author', e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300"
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            value={formData.testimonial.role}
            onChange={(e) => updateTestimonial('role', e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300"
            placeholder="Job title"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
        <input
          type="text"
          value={formData.testimonial.org}
          onChange={(e) => updateTestimonial('org', e.target.value)}
          className="w-full p-3 border rounded-lg border-gray-300"
          placeholder="Organization name"
        />
      </div>
    </div>
  );
};

export default TestimonialFields;

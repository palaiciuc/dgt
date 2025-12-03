import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CaseStudyFormData, emptyCaseStudyForm, CaseStudy } from '@/types/caseStudy';
import CaseStudyBasicFields from './CaseStudyBasicFields';
import CaseStudyArrayFields from './CaseStudyArrayFields';
import ImageUpload from './ImageUpload';
import TestimonialFields from './TestimonialFields';

interface Props {
  isOpen: boolean;
  editingStudy: CaseStudy | null;
  onClose: () => void;
  onSubmit: (data: CaseStudyFormData) => Promise<void>;
  isLoading: boolean;
}

const CaseStudyFormModal: React.FC<Props> = ({ isOpen, editingStudy, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CaseStudyFormData>(emptyCaseStudyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingStudy) {
      setFormData({
        slug: editingStudy.slug,
        tag: editingStudy.tag,
        title: editingStudy.title,
        description: editingStudy.description,
        client: editingStudy.client,
        short_desc: editingStudy.short_desc || '',
        overview: editingStudy.overview || '',
        challenges: editingStudy.challenges?.length ? editingStudy.challenges : [''],
        architecture_image: editingStudy.architecture_image || '',
        timeline: editingStudy.timeline?.length ? editingStudy.timeline : [{ phase: '', duration: '', description: '' }],
        metrics: editingStudy.metrics?.length ? editingStudy.metrics : [{ value: '', label: '' }],
        testimonial: editingStudy.testimonial || { quote: '', author: '', role: '', org: '' }
      });
    } else {
      setFormData(emptyCaseStudyForm);
    }
    setErrors({});
  }, [editingStudy, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.tag.trim()) newErrors.tag = 'Tag is required';
    if (!formData.client.trim()) newErrors.client = 'Client is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CaseStudyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">{editingStudy ? 'Edit' : 'Create'} Case Study</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          <CaseStudyBasicFields formData={formData} errors={errors} onChange={handleChange} />
          <ImageUpload 
            value={formData.architecture_image} 
            onChange={(url) => handleChange('architecture_image', url)} 
            label="Architecture Diagram"
            folder="case-studies"
            aspectRatio="aspect-video"
          />
          <CaseStudyArrayFields formData={formData} onChange={handleChange} />
          <TestimonialFields formData={formData} onChange={handleChange} />
        </form>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-2 bg-[#003B8E] text-white rounded-lg hover:bg-[#002d6e] disabled:opacity-50 flex items-center gap-2">
            {isLoading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            {editingStudy ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyFormModal;

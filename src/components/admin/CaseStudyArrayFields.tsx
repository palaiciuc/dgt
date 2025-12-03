import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CaseStudyFormData, TimelineItem, MetricItem } from '@/types/caseStudy';

interface Props {
  formData: CaseStudyFormData;
  onChange: (field: keyof CaseStudyFormData, value: any) => void;
}

const CaseStudyArrayFields: React.FC<Props> = ({ formData, onChange }) => {
  const addChallenge = () => onChange('challenges', [...formData.challenges, '']);
  const removeChallenge = (i: number) => onChange('challenges', formData.challenges.filter((_, idx) => idx !== i));
  const updateChallenge = (i: number, val: string) => {
    const updated = [...formData.challenges];
    updated[i] = val;
    onChange('challenges', updated);
  };

  const addTimeline = () => onChange('timeline', [...formData.timeline, { phase: '', duration: '', description: '' }]);
  const removeTimeline = (i: number) => onChange('timeline', formData.timeline.filter((_, idx) => idx !== i));
  const updateTimeline = (i: number, field: keyof TimelineItem, val: string) => {
    const updated = [...formData.timeline];
    updated[i] = { ...updated[i], [field]: val };
    onChange('timeline', updated);
  };

  const addMetric = () => onChange('metrics', [...formData.metrics, { value: '', label: '' }]);
  const removeMetric = (i: number) => onChange('metrics', formData.metrics.filter((_, idx) => idx !== i));
  const updateMetric = (i: number, field: keyof MetricItem, val: string) => {
    const updated = [...formData.metrics];
    updated[i] = { ...updated[i], [field]: val };
    onChange('metrics', updated);
  };

  return (
    <div className="space-y-6">
      {/* Challenges */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Challenges</label>
          <button type="button" onClick={addChallenge} className="text-[#003B8E] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {formData.challenges.map((c, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={c} onChange={(e) => updateChallenge(i, e.target.value)} className="flex-1 p-2 border rounded-lg text-sm" placeholder="Challenge" />
            {formData.challenges.length > 1 && (
              <button type="button" onClick={() => removeChallenge(i)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Timeline</label>
          <button type="button" onClick={addTimeline} className="text-[#003B8E] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {formData.timeline.map((t, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={t.phase} onChange={(e) => updateTimeline(i, 'phase', e.target.value)} className="w-1/4 p-2 border rounded-lg text-sm" placeholder="Phase" />
            <input value={t.duration} onChange={(e) => updateTimeline(i, 'duration', e.target.value)} className="w-1/4 p-2 border rounded-lg text-sm" placeholder="Duration" />
            <input value={t.description} onChange={(e) => updateTimeline(i, 'description', e.target.value)} className="flex-1 p-2 border rounded-lg text-sm" placeholder="Description" />
            {formData.timeline.length > 1 && (
              <button type="button" onClick={() => removeTimeline(i)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Metrics</label>
          <button type="button" onClick={addMetric} className="text-[#003B8E] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {formData.metrics.map((m, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={m.value} onChange={(e) => updateMetric(i, 'value', e.target.value)} className="w-1/3 p-2 border rounded-lg text-sm" placeholder="Value" />
            <input value={m.label} onChange={(e) => updateMetric(i, 'label', e.target.value)} className="flex-1 p-2 border rounded-lg text-sm" placeholder="Label" />
            {formData.metrics.length > 1 && (
              <button type="button" onClick={() => removeMetric(i)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseStudyArrayFields;

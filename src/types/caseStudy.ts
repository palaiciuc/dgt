export interface TimelineItem {
  phase: string;
  duration: string;
  description: string;
}

export interface MetricItem {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  org: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  tag: string;
  title: string;
  description: string;
  client: string;
  short_desc: string;
  overview: string;
  challenges: string[];
  architecture_image: string;
  timeline: TimelineItem[];
  metrics: MetricItem[];
  testimonial: Testimonial;
  created_at?: string;
  updated_at?: string;
}

export interface CaseStudyFormData {
  slug: string;
  tag: string;
  title: string;
  description: string;
  client: string;
  short_desc: string;
  overview: string;
  challenges: string[];
  architecture_image: string;
  timeline: TimelineItem[];
  metrics: MetricItem[];
  testimonial: Testimonial;
}

export const emptyCaseStudyForm: CaseStudyFormData = {
  slug: '',
  tag: '',
  title: '',
  description: '',
  client: '',
  short_desc: '',
  overview: '',
  challenges: [''],
  architecture_image: '',
  timeline: [{ phase: '', duration: '', description: '' }],
  metrics: [{ value: '', label: '' }],
  testimonial: { quote: '', author: '', role: '', org: '' }
};

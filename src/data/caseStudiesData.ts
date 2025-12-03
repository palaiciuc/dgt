export interface CaseStudy {
  id: string;
  slug: string;
  tag: string;
  title: string;
  description: string;
  client: string;
  shortDesc: string;
  overview: string;
  challenges: string[];
  architectureImage: string;
  timeline: { phase: string; duration: string; description: string }[];
  metrics: { value: string; label: string }[];
  testimonial: { quote: string; author: string; role: string; org: string };
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'national-gsb', slug: 'national-gsb', tag: 'National GSB', title: 'Inter-agency data exchange',
    description: 'Government Service Bus connecting core registers and payment platforms.',
    client: 'Ministry of Communications', shortDesc: 'GSB connecting core registers, tax systems, and payment platforms.',
    overview: 'The National GSB established secure infrastructure for real-time data exchange between 47 agencies.',
    challenges: ['Legacy systems with incompatible formats', 'No standardized API protocols', 'Security concerns around data sharing'],
    architectureImage: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764405660803_584951c8.webp',
    timeline: [{ phase: 'Discovery', duration: '3 months', description: 'Architecture design' }, { phase: 'Development', duration: '6 months', description: 'Core engine' }],
    metrics: [{ value: '47', label: 'Agencies' }, { value: '2.3M', label: 'Daily Transactions' }, { value: '99.97%', label: 'Uptime' }],
    testimonial: { quote: 'The GSB transformed how our government operates.', author: 'Dr. Sarah Mensah', role: 'Director', org: 'Ministry of Communications' }
  },
  {
    id: 'digital-payments', slug: 'digital-payments', tag: 'Digital Payments', title: 'Unified revenue collection',
    description: 'Integration with banks and mobile money for government revenues.',
    client: 'Ministry of Finance', shortDesc: 'Banks and mobile money integration for government revenues.',
    overview: 'Unified Revenue Collection Platform consolidated fragmented payment channels.',
    challenges: ['Disconnected payment systems', 'Manual reconciliation', 'Limited rural payment options'],
    architectureImage: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764405662721_0bbd9833.webp',
    timeline: [{ phase: 'Design', duration: '2 months', description: 'Architecture' }, { phase: 'Build', duration: '5 months', description: 'Payment gateway' }],
    metrics: [{ value: '$847M', label: 'Revenue' }, { value: '34%', label: 'Increase' }, { value: '3,200+', label: 'Payment Points' }],
    testimonial: { quote: 'Revenue collection efficiency improved dramatically.', author: 'Hon. James Okonkwo', role: 'Secretary', org: 'Ministry of Finance' }
  },
  {
    id: 'citizen-portal', slug: 'citizen-portal', tag: 'Portals', title: 'Citizen and business services',
    description: 'One-stop portals for applications and status tracking.',
    client: 'ICT Authority', shortDesc: 'One-stop portals consolidating applications and notifications.',
    overview: 'National Citizen Services Portal provides unified access to 200+ government services.',
    challenges: ['Multiple office visits required', 'No unified identity verification', 'Paper-based delays'],
    architectureImage: 'https://d64gsuwffb70l.cloudfront.net/692ab028e92d4357e4923362_1764405664598_c9ba604c.webp',
    timeline: [{ phase: 'Research', duration: '2 months', description: 'Journey mapping' }, { phase: 'Development', duration: '6 months', description: 'Portal build' }],
    metrics: [{ value: '200+', label: 'Services' }, { value: '4.2M', label: 'Users' }, { value: '89%', label: 'Satisfaction' }],
    testimonial: { quote: 'I renewed my license and paid taxes all in one sitting.', author: 'Amina Diallo', role: 'CEO', org: 'Sahel Exports Ltd.' }
  }
];

export const caseStudiesData = caseStudies;

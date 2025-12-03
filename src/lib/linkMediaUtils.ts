import { supabase } from '@/lib/supabase';

const BUCKET = 'site-images';

export interface LinkResult {
  table: string;
  linked: number;
  errors: string[];
}

function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const solutionMediaMap: Record<string, string> = {
  'data-exchange.webp': 'Data Exchange',
  'payments.webp': 'Payments',
  'identity.webp': 'Identity',
  'portal.webp': 'Portal',
  'analytics.webp': 'Analytics',
  'documents.webp': 'Documents',
};

const platformMediaMap: Record<string, string> = {
  'cloud-infrastructure.webp': 'Cloud Infrastructure',
  'api-gateway.webp': 'API Gateway',
  'security-framework.webp': 'Security Framework',
  'integration-hub.webp': 'Integration Hub',
};

const aiFeatureMediaMap: Record<string, string> = {
  'document-processing.webp': 'Document Processing',
  'predictive-analytics.webp': 'Predictive Analytics',
  'fraud-detection.webp': 'Fraud Detection',
  'citizen-assistance.webp': 'Citizen Assistance',
};

const aboutMediaMap: Record<string, number> = {
  'team-member-1.webp': 1,
  'team-member-2.webp': 2,
  'team-member-3.webp': 3,
  'team-member-4.webp': 4,
};

export async function linkSolutionMedia(): Promise<LinkResult> {
  const result: LinkResult = { table: 'solutions', linked: 0, errors: [] };
  for (const [filename, tag] of Object.entries(solutionMediaMap)) {
    const imageUrl = getPublicUrl(`solutions/${filename}`);
    const { error } = await supabase.from('solutions').update({ image_url: imageUrl }).eq('tag', tag);
    if (error) result.errors.push(`${tag}: ${error.message}`);
    else result.linked++;
  }
  return result;
}

export async function linkPlatformMedia(): Promise<LinkResult> {
  const result: LinkResult = { table: 'platforms', linked: 0, errors: [] };
  for (const [filename, title] of Object.entries(platformMediaMap)) {
    const imageUrl = getPublicUrl(`platforms/${filename}`);
    const { error } = await supabase.from('platforms').update({ image_url: imageUrl }).eq('title', title);
    if (error) result.errors.push(`${title}: ${error.message}`);
    else result.linked++;
  }
  return result;
}

export async function linkAIFeatureMedia(): Promise<LinkResult> {
  const result: LinkResult = { table: 'ai_features', linked: 0, errors: [] };
  for (const [filename, title] of Object.entries(aiFeatureMediaMap)) {
    const imageUrl = getPublicUrl(`ai-features/${filename}`);
    const { error } = await supabase.from('ai_features').update({ image_url: imageUrl }).eq('title', title);
    if (error) result.errors.push(`${title}: ${error.message}`);
    else result.linked++;
  }
  return result;
}

export async function linkCaseStudyMedia(): Promise<LinkResult> {
  const result: LinkResult = { table: 'case_studies', linked: 0, errors: [] };
  const { data: caseStudies } = await supabase.from('case_studies').select('id').order('created_at', { ascending: true });
  if (!caseStudies) return result;
  for (let i = 0; i < Math.min(caseStudies.length, 4); i++) {
    const imageUrl = getPublicUrl(`case-studies/case-study-${i + 1}.webp`);
    const { error } = await supabase.from('case_studies').update({ image_url: imageUrl }).eq('id', caseStudies[i].id);
    if (error) result.errors.push(`Case study ${i + 1}: ${error.message}`);
    else result.linked++;
  }
  return result;
}

export async function linkAboutMedia(): Promise<LinkResult> {
  const result: LinkResult = { table: 'about_values', linked: 0, errors: [] };
  const { data: aboutValues } = await supabase.from('about_values').select('id, display_order').order('display_order', { ascending: true });
  if (!aboutValues) return result;
  for (const [filename, order] of Object.entries(aboutMediaMap)) {
    const aboutValue = aboutValues.find(v => v.display_order === order);
    if (!aboutValue) continue;
    const imageUrl = getPublicUrl(`about/${filename}`);
    const { error } = await supabase.from('about_values').update({ image_url: imageUrl }).eq('id', aboutValue.id);
    if (error) result.errors.push(`About value ${order}: ${error.message}`);
    else result.linked++;
  }
  return result;
}

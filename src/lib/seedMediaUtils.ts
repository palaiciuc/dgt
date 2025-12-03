import { supabase } from '@/lib/supabase';
import { defaultMediaAssets, MediaCategory, MEDIA_CATEGORIES } from './seedMediaData';

const BUCKET = 'site-images';

export interface MediaSeedResult {
  category: string;
  uploaded: number;
  skipped: number;
  errors: string[];
}

async function fetchImageAsBlob(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}

async function checkFileExists(path: string): Promise<boolean> {
  const { data } = await supabase.storage.from(BUCKET).list(path.split('/')[0], {
    search: path.split('/')[1]
  });
  return data?.some(f => f.name === path.split('/')[1]) || false;
}

export async function seedMediaCategory(category: MediaCategory, force = false): Promise<MediaSeedResult> {
  const result: MediaSeedResult = { category, uploaded: 0, skipped: 0, errors: [] };
  const assets = defaultMediaAssets[category];
  
  // Ensure folder exists by creating a placeholder if needed
  const folder = category === 'hero' ? 'about' : category;
  
  for (const asset of assets) {
    const filePath = `${folder}/${asset.name}`;
    
    if (!force) {
      const exists = await checkFileExists(filePath);
      if (exists) { result.skipped++; continue; }
    }
    
    const blob = await fetchImageAsBlob(asset.url);
    if (!blob) { result.errors.push(`Failed to fetch ${asset.name}`); continue; }
    
    const { error } = await supabase.storage.from(BUCKET).upload(filePath, blob, {
      contentType: 'image/webp',
      upsert: force
    });
    
    if (error) result.errors.push(`${asset.name}: ${error.message}`);
    else result.uploaded++;
  }
  
  return result;
}

export async function seedAllMedia(force = false): Promise<MediaSeedResult[]> {
  const results: MediaSeedResult[] = [];
  for (const category of MEDIA_CATEGORIES) {
    const result = await seedMediaCategory(category, force);
    results.push(result);
  }
  return results;
}

export function getMediaSeedSummary(results: MediaSeedResult[]): { success: boolean; message: string } {
  const total = results.reduce((acc, r) => acc + r.uploaded, 0);
  const skipped = results.reduce((acc, r) => acc + r.skipped, 0);
  const errors = results.flatMap(r => r.errors);
  
  if (errors.length > 0) {
    return { success: false, message: `Uploaded ${total}, skipped ${skipped}, ${errors.length} errors` };
  }
  return { success: true, message: `Uploaded ${total} images, skipped ${skipped} existing` };
}

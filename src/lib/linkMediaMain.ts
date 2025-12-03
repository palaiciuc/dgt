import { 
  linkSolutionMedia, 
  linkPlatformMedia, 
  linkAIFeatureMedia, 
  linkCaseStudyMedia,
  linkAboutMedia,
  LinkResult 
} from './linkMediaUtils';

export async function linkAllMedia(): Promise<LinkResult[]> {
  const results: LinkResult[] = [];
  
  // Link each category
  results.push(await linkSolutionMedia());
  results.push(await linkPlatformMedia());
  results.push(await linkAIFeatureMedia());
  results.push(await linkCaseStudyMedia());
  results.push(await linkAboutMedia());
  
  return results;
}

export function getLinkSummary(results: LinkResult[]): { success: boolean; message: string } {
  const totalLinked = results.reduce((sum, r) => sum + r.linked, 0);
  const allErrors = results.flatMap(r => r.errors);
  
  if (allErrors.length > 0) {
    return { 
      success: false, 
      message: `Linked ${totalLinked} images with ${allErrors.length} errors: ${allErrors.slice(0, 2).join(', ')}` 
    };
  }
  
  const details = results.map(r => `${r.table}: ${r.linked}`).join(', ');
  return { 
    success: true, 
    message: `Successfully linked ${totalLinked} images (${details})` 
  };
}

// Combined function to seed media and link it in one step
export async function seedAndLinkMedia(
  seedFn: (force?: boolean) => Promise<any[]>,
  force = false
): Promise<{ seedResults: any[]; linkResults: LinkResult[] }> {
  // First seed the media
  const seedResults = await seedFn(force);
  
  // Then link it to database records
  const linkResults = await linkAllMedia();
  
  return { seedResults, linkResults };
}

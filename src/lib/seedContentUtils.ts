import { supabase } from '@/lib/supabase';
import { defaultSolutions, defaultPlatforms, defaultAIFeatures, defaultAboutValues } from './seedContent';
import { seedSettings } from './seedSettings';

export interface ContentSeedResult {
  table: string;
  created: number;
  skipped: number;
  errors: string[];
}

async function seedTable(tableName: string, data: any[]): Promise<ContentSeedResult> {
  const result: ContentSeedResult = { table: tableName, created: 0, skipped: 0, errors: [] };
  
  // Check existing count
  const { count } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
  
  if (count && count > 0) {
    result.skipped = data.length;
    return result;
  }
  
  // Insert all data
  const { error } = await supabase.from(tableName).insert(data);
  
  if (error) {
    result.errors.push(error.message);
  } else {
    result.created = data.length;
  }
  
  return result;
}

async function forceResetTable(tableName: string, data: any[]): Promise<ContentSeedResult> {
  const result: ContentSeedResult = { table: tableName, created: 0, skipped: 0, errors: [] };
  
  // Delete all existing
  const { error: deleteError } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) {
    result.errors.push(`Delete error: ${deleteError.message}`);
    return result;
  }
  
  // Insert fresh data
  const { error } = await supabase.from(tableName).insert(data);
  
  if (error) {
    result.errors.push(error.message);
  } else {
    result.created = data.length;
  }
  
  return result;
}

export async function seedAllContent(force = false): Promise<ContentSeedResult[]> {
  const tables = [
    { name: 'solutions', data: defaultSolutions },
    { name: 'platforms', data: defaultPlatforms },
    { name: 'ai_features', data: defaultAIFeatures },
    { name: 'about_values', data: defaultAboutValues },
  ];
  
  const results: ContentSeedResult[] = [];
  
  for (const table of tables) {
    const result = force 
      ? await forceResetTable(table.name, table.data)
      : await seedTable(table.name, table.data);
    results.push(result);
  }
  
  // Also seed settings
  await seedSettings(force);
  
  return results;
}

export function getSeedSummary(results: ContentSeedResult[]): { success: boolean; message: string } {
  const totalCreated = results.reduce((sum, r) => sum + r.created, 0);
  const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
  const allErrors = results.flatMap(r => r.errors);
  
  if (allErrors.length > 0) {
    return { success: false, message: `Errors: ${allErrors.join(', ')}` };
  }
  
  if (totalCreated === 0 && totalSkipped > 0) {
    return { success: true, message: `All tables already have data (${totalSkipped} items skipped)` };
  }
  
  return { success: true, message: `Successfully seeded ${totalCreated} items across ${results.length} tables` };
}

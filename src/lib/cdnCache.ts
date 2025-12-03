import { supabase } from './supabase';

export interface CacheConfig {
  maxAge: number;
  cacheControl: 'public' | 'private' | 'no-cache';
  staleWhileRevalidate: boolean;
  immutable: boolean;
}

export interface CacheStats {
  entries: number;
  totalSize: number;
  totalHits: number;
  hitRate: string;
}

const DEFAULT_CONFIG: CacheConfig = {
  maxAge: 86400,
  cacheControl: 'public',
  staleWhileRevalidate: true,
  immutable: false
};

export const getCacheConfig = (): CacheConfig => {
  const stored = localStorage.getItem('cdn-cache-config');
  return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
};

export const saveCacheConfig = (config: CacheConfig): void => {
  localStorage.setItem('cdn-cache-config', JSON.stringify(config));
};

export const purgeCache = async (urls?: string[]): Promise<{ success: boolean; message: string }> => {
  const { data, error } = await supabase.functions.invoke('cdn-cache-manager', {
    body: { action: 'purge', urls }
  });
  if (error) throw error;
  return data;
};

export const purgeFolder = async (folder: string): Promise<{ success: boolean; message: string }> => {
  const { data, error } = await supabase.functions.invoke('cdn-cache-manager', {
    body: { action: 'purge-folder', folder }
  });
  if (error) throw error;
  return data;
};

export const invalidateUrls = async (urls: string[]): Promise<{ success: boolean; message: string }> => {
  const { data, error } = await supabase.functions.invoke('cdn-cache-manager', {
    body: { action: 'invalidate', urls }
  });
  if (error) throw error;
  return data;
};

export const getCacheHeaders = async (config?: Partial<CacheConfig>): Promise<Record<string, string>> => {
  const finalConfig = { ...getCacheConfig(), ...config };
  const { data, error } = await supabase.functions.invoke('cdn-cache-manager', {
    body: { action: 'get-headers', maxAge: finalConfig.maxAge, cacheControl: finalConfig.cacheControl }
  });
  if (error) throw error;
  return data.headers;
};

export const getCacheStats = async (): Promise<CacheStats> => {
  const { data, error } = await supabase.functions.invoke('cdn-cache-manager', {
    body: { action: 'stats' }
  });
  if (error) throw error;
  return data.stats;
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

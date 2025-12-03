import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, Trash2, Settings, BarChart3, Loader2, FolderOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CacheConfig, CacheStats, getCacheConfig, saveCacheConfig, purgeCache, getCacheStats, formatBytes, formatDuration } from '@/lib/cdnCache';

interface CDNCachePanelProps {
  onPurgeComplete?: () => void;
}

const CDNCachePanel: React.FC<CDNCachePanelProps> = ({ onPurgeComplete }) => {
  const [config, setConfig] = useState<CacheConfig>(getCacheConfig());
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [purging, setPurging] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getCacheStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
    setLoading(false);
  };

  const handleConfigChange = (key: keyof CacheConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    saveCacheConfig(newConfig);
    toast({ title: 'Settings saved', description: 'Cache configuration updated' });
  };

  const handlePurgeAll = async () => {
    setPurging(true);
    try {
      const result = await purgeCache();
      toast({ title: 'Cache Purged', description: result.message });
      await loadStats();
      onPurgeComplete?.();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to purge cache', variant: 'destructive' });
    }
    setPurging(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-[#003B8E]" />
            Cache Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-[#003B8E]">{stats.entries}</p>
                <p className="text-xs text-gray-500">Cached Items</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{formatBytes(stats.totalSize)}</p>
                <p className="text-xs text-gray-500">Total Size</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{stats.totalHits}</p>
                <p className="text-xs text-gray-500">Total Hits</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{stats.hitRate}%</p>
                <p className="text-xs text-gray-500">Hit Rate</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No stats available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-[#003B8E]" />
            Cache Headers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Max Age: {formatDuration(config.maxAge)}</Label>
            <Slider value={[config.maxAge]} onValueChange={([v]) => handleConfigChange('maxAge', v)} min={3600} max={604800} step={3600} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Cache Control</Label>
            <Select value={config.cacheControl} onValueChange={v => handleConfigChange('cacheControl', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="no-cache">No Cache</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Stale While Revalidate</Label>
            <Switch checked={config.staleWhileRevalidate} onCheckedChange={v => handleConfigChange('staleWhileRevalidate', v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Immutable</Label>
            <Switch checked={config.immutable} onCheckedChange={v => handleConfigChange('immutable', v)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-[#003B8E]" />
            Cache Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={handlePurgeAll} variant="destructive" disabled={purging}>
            {purging ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Purge All Cache
          </Button>
          <Button onClick={loadStats} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CDNCachePanel;

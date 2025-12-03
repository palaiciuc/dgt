import React, { useState, useEffect } from 'react';
import { Image, RefreshCw, Search, Download, Loader2, Link2, Plus, Grid3X3, List, CheckSquare, Trash2, Cloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import MediaCard from '@/components/admin/MediaCard';
import MediaUploadModal, { UploadFile } from '@/components/admin/MediaUploadModal';
import MediaFilters from '@/components/admin/MediaFilters';
import CDNCachePanel from '@/components/admin/CDNCachePanel';
import { seedAllMedia, getMediaSeedSummary } from '@/lib/seedMediaUtils';
import { linkAllMedia, getLinkSummary } from '@/lib/linkMediaMain';
import { OptimizationOptions } from '@/lib/imageOptimization';
import { processImage } from '@/lib/imageOptimizationProcess';
import { invalidateUrls, purgeFolder } from '@/lib/cdnCache';

interface MediaFile { name: string; url: string; size: number; createdAt: string; folder: string; }
const FOLDERS = ['solutions', 'platforms', 'ai-features', 'case-studies', 'about', 'general'];
const BUCKET = 'site-images';

const AdminMedia: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [linking, setLinking] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [deleteFile, setDeleteFile] = useState<MediaFile | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [cacheOpen, setCacheOpen] = useState(false);
  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    const allFiles: MediaFile[] = [];
    for (const folder of FOLDERS) {
      const { data } = await supabase.storage.from(BUCKET).list(folder);
      if (data) {
        for (const file of data) {
          if (file.name && file.id) {
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(`${folder}/${file.name}`);
            allFiles.push({ name: file.name, url: urlData.publicUrl, size: file.metadata?.size || 0, createdAt: file.created_at || new Date().toISOString(), folder });
          }
        }
      }
    }
    setFiles(allFiles);
    setLoading(false);
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (uploadFiles: UploadFile[], folder: string, options: OptimizationOptions) => {
    let uploaded = 0;
    const uploadedUrls: string[] = [];
    for (const uf of uploadFiles) {
      try {
        const processed = await processImage(uf.file, options);
        for (const p of processed) {
          const path = `${folder}/${uf.name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}-${p.sizeName}.${p.result.format}`;
          const { data } = await supabase.storage.from(BUCKET).upload(path, p.result.blob);
          if (data) {
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
            uploadedUrls.push(urlData.publicUrl);
          }
        }
        uploaded++;
      } catch (err) { console.error('Upload error:', err); }
    }
    // Invalidate cache for uploaded images
    if (uploadedUrls.length > 0) {
      try { await invalidateUrls(uploadedUrls); } catch (e) { console.error('Cache invalidation error:', e); }
    }
    toast({ title: 'Success', description: `Uploaded ${uploaded} optimized image(s)` });
    fetchFiles();
  };

  const handleDelete = async () => {
    if (!deleteFile) return;
    await supabase.storage.from(BUCKET).remove([`${deleteFile.folder}/${deleteFile.name}`]);
    // Invalidate cache for deleted image
    try { await invalidateUrls([deleteFile.url]); } catch (e) { console.error('Cache invalidation error:', e); }
    setFiles(files.filter(f => f.url !== deleteFile.url));
    setDeleteFile(null);
    toast({ title: 'Deleted', description: 'Image deleted and cache invalidated' });
  };

  const handleBulkDelete = async () => {
    const toDelete = files.filter(f => selectedFiles.has(f.url));
    const paths = toDelete.map(f => `${f.folder}/${f.name}`);
    const urls = toDelete.map(f => f.url);
    await supabase.storage.from(BUCKET).remove(paths);
    try { await invalidateUrls(urls); } catch (e) { console.error('Cache invalidation error:', e); }
    setFiles(files.filter(f => !selectedFiles.has(f.url)));
    setSelectedFiles(new Set());
    setSelectMode(false);
    toast({ title: 'Deleted', description: `${urls.length} images deleted and cache invalidated` });
  };

  const handleSeedMedia = async () => { setSeeding(true); const results = await seedAllMedia(false); toast({ title: 'Done', description: getMediaSeedSummary(results).message }); fetchFiles(); setSeeding(false); };
  const handleLinkMedia = async () => { setLinking(true); const results = await linkAllMedia(); toast({ title: 'Done', description: getLinkSummary(results).message }); setLinking(false); };
  const handleCopy = (url: string) => { navigator.clipboard.writeText(url); toast({ title: 'Copied' }); };
  const toggleSelect = (url: string) => { const n = new Set(selectedFiles); n.has(url) ? n.delete(url) : n.add(url); setSelectedFiles(n); };
  const clearFilters = () => { setCategoryFilter('all'); setSizeFilter('all'); setDateFilter('all'); };
  const activeFiltersCount = [categoryFilter, sizeFilter, dateFilter].filter(f => f !== 'all').length;

  const filtered = files.filter(f => {
    if (activeTab !== 'all' && f.folder !== activeTab) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (sizeFilter === 'small' && f.size >= 100000) return false;
    if (sizeFilter === 'medium' && (f.size < 100000 || f.size > 1000000)) return false;
    if (sizeFilter === 'large' && f.size <= 1000000) return false;
    return true;
  }).sort((a, b) => sortBy === 'newest' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : a.name.localeCompare(b.name));

  const folderCounts = FOLDERS.reduce((acc, f) => ({ ...acc, [f]: files.filter(file => file.folder === f).length }), {} as Record<string, number>);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#003B8E]/10 rounded-xl flex items-center justify-center"><Image className="w-6 h-6 text-[#003B8E]" /></div>
          <div><h1 className="text-2xl font-bold">Media Library</h1><p className="text-gray-500">{files.length} images</p></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setUploadOpen(true)} className="bg-[#003B8E]"><Plus className="w-4 h-4 mr-2" />Upload</Button>
          <Button onClick={() => setCacheOpen(true)} variant="outline"><Cloud className="w-4 h-4 mr-2" />CDN Cache</Button>
          <Button onClick={handleSeedMedia} disabled={seeding} variant="outline">{seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}</Button>
          <Button onClick={handleLinkMedia} disabled={linking} variant="outline">{linking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}</Button>
          <Button onClick={fetchFiles} variant="outline"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
        </div>
      </div>
      <MediaFilters categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} sizeFilter={sizeFilter} setSizeFilter={setSizeFilter} dateFilter={dateFilter} setDateFilter={setDateFilter} sortBy={sortBy} setSortBy={setSortBy} onClearFilters={clearFilters} activeFiltersCount={activeFiltersCount} />
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}><Grid3X3 className="w-4 h-4" /></Button>
        <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        <Button variant={selectMode ? 'default' : 'outline'} size="sm" onClick={() => { setSelectMode(!selectMode); setSelectedFiles(new Set()); }}><CheckSquare className="w-4 h-4" /></Button>
        {selectMode && selectedFiles.size > 0 && <Button variant="destructive" size="sm" onClick={handleBulkDelete}><Trash2 className="w-4 h-4 mr-1" />{selectedFiles.size}</Button>}
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4"><TabsTrigger value="all">All ({files.length})</TabsTrigger>{FOLDERS.map(f => <TabsTrigger key={f} value={f}>{f} ({folderCounts[f] || 0})</TabsTrigger>)}</TabsList>
        <TabsContent value={activeTab}>
          {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : filtered.length === 0 ? <p className="text-center py-12 text-gray-500">No images found</p>
          : <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>{filtered.map(file => <MediaCard key={file.url} file={file} onDelete={setDeleteFile} onCopyUrl={handleCopy} onView={setSelectedFile} selectMode={selectMode} selected={selectedFiles.has(file.url)} onToggleSelect={() => toggleSelect(file.url)} viewMode={viewMode} />)}</div>}
        </TabsContent>
      </Tabs>
      <MediaUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={handleUpload} folders={FOLDERS} />
      <Sheet open={cacheOpen} onOpenChange={setCacheOpen}><SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto"><SheetHeader><SheetTitle>CDN Cache Management</SheetTitle></SheetHeader><div className="mt-6"><CDNCachePanel onPurgeComplete={fetchFiles} /></div></SheetContent></Sheet>
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}><DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>{selectedFile?.name}</DialogTitle></DialogHeader>{selectedFile && <img src={selectedFile.url} alt={selectedFile.name} className="w-full rounded-lg" />}</DialogContent></Dialog>
      <AlertDialog open={!!deleteFile} onOpenChange={() => setDeleteFile(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>Delete "{deleteFile?.name}"?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};

export default AdminMedia;

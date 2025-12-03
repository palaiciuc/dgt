import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ICON_OPTIONS } from '@/types/adminTypes';
import { Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  title: string;
  showTag?: boolean;
  showIcon?: boolean;
  showImage?: boolean;
  imageFolder?: string;
}

export const ContentFormModal: React.FC<ContentFormModalProps> = ({
  isOpen, onClose, onSubmit, initialData, title, showTag = false, showIcon = true, showImage = false, imageFolder = 'general'
}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', tag: '', icon: '', image_url: '', display_order: 0, is_active: true });

  useEffect(() => {
    if (initialData) {
      setForm({ title: initialData.title || '', description: initialData.description || '', tag: initialData.tag || '', icon: initialData.icon || '', image_url: initialData.image_url || '', display_order: initialData.display_order || 0, is_active: initialData.is_active ?? true });
    } else {
      setForm({ title: '', description: '', tag: '', icon: '', image_url: '', display_order: 0, is_active: true });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit(form); onClose(); } finally { setLoading(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{initialData ? 'Edit' : 'Add'} {title}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showTag && (<div><Label>Tag</Label><Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g., Integration" required /></div>)}
          <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><Label>Description *</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required /></div>
          {showIcon && (<div><Label>Icon</Label><Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}><SelectTrigger><SelectValue placeholder="Select icon" /></SelectTrigger><SelectContent>{ICON_OPTIONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>)}
          {showImage && (
            <ImageUpload 
              value={form.image_url} 
              onChange={(url) => setForm({ ...form, image_url: url })} 
              label="Image"
              folder={imageFolder}
              aspectRatio="aspect-video"
            />
          )}
          <div><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: c })} /><Label>Active</Label></div>
          <div className="flex gap-2 pt-4"><Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button><Button type="submit" disabled={loading} className="flex-1 bg-[#003B8E]">{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{initialData ? 'Update' : 'Create'}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

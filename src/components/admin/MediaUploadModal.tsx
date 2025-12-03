import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileImage, FileType, Image, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import MediaFileItem from './MediaFileItem';
import ImageOptimizationSettings from './ImageOptimizationSettings';
import { OptimizationOptions, DEFAULT_OPTIONS } from '@/lib/imageOptimization';

export interface UploadFile {
  file: File;
  preview: string;
  category: string;
  tags: string[];
  name: string;
}

interface MediaUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: UploadFile[], folder: string, options: OptimizationOptions) => Promise<void>;
  folders: string[];
}

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({ open, onClose, onUpload, folders }) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [folder, setFolder] = useState(folders[0] || 'general');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showOptimization, setShowOptimization] = useState(true);
  const [optimizationOptions, setOptimizationOptions] = useState<OptimizationOptions>(DEFAULT_OPTIONS);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        file,
        preview: URL.createObjectURL(file),
        category: 'photo',
        tags: [],
        name: file.name.replace(/\.[^/.]+$/, ''),
      }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles(files.filter((_, i) => i !== index));
  };

  const updateFile = (index: number, updates: Partial<UploadFile>) => {
    setFiles(files.map((f, i) => i === index ? { ...f, ...updates } : f));
  };

  const addTag = (index: number) => {
    if (tagInput.trim()) {
      const file = files[index];
      if (!file.tags.includes(tagInput.trim())) {
        updateFile(index, { tags: [...file.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      await onUpload(files, folder, optimizationOptions);
      files.forEach(f => URL.revokeObjectURL(f.preview));
      setFiles([]);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  const estimatedFiles = files.length * (optimizationOptions.generateThumbnails ? 5 : 1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" /> Upload Media
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Destination Folder</Label>
              <Select value={folder} onValueChange={setFolder}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {folders.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Collapsible open={showOptimization} onOpenChange={setShowOptimization}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <span className="font-medium text-gray-700">Optimization Settings</span>
                {showOptimization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ImageOptimizationSettings options={optimizationOptions} onChange={setOptimizationOptions} />
            </CollapsibleContent>
          </Collapsible>

          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragActive ? 'border-[#003B8E] bg-blue-50' : 'border-gray-300 hover:border-[#003B8E]'}`}
          >
            <Upload className={`w-10 h-10 mx-auto mb-2 ${dragActive ? 'text-[#003B8E]' : 'text-gray-400'}`} />
            <p className="font-medium text-gray-700">Drag & drop images here</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, WebP up to 10MB</p>
          </div>
          <input ref={inputRef} type="file" multiple accept="image/*" onChange={e => e.target.files && handleFiles(e.target.files)} className="hidden" />

          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Files ({files.length})</h3>
                <span className="text-sm text-gray-500">~{estimatedFiles} files will be created</span>
              </div>
              {files.map((f, i) => (
                <MediaFileItem key={i} file={f} index={i} onRemove={removeFile} onUpdate={updateFile} tagInput={tagInput} setTagInput={setTagInput} onAddTag={addTag} />
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={files.length === 0 || uploading} className="bg-[#003B8E]">
              {uploading ? 'Processing...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;

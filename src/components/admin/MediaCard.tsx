import React from 'react';
import { Trash2, Copy, ExternalLink, FileImage, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  folder: string;
}

interface MediaCardProps {
  file: MediaFile;
  onDelete: (file: MediaFile) => void;
  onCopyUrl: (url: string) => void;
  onView: (file: MediaFile) => void;
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  viewMode?: 'grid' | 'list';
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const MediaCard: React.FC<MediaCardProps> = ({ 
  file, 
  onDelete, 
  onCopyUrl, 
  onView, 
  selectMode = false,
  selected = false,
  onToggleSelect,
  viewMode = 'grid'
}) => {
  if (viewMode === 'list') {
    return (
      <div className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${selected ? 'bg-[#003B8E]/5 border-[#003B8E]' : 'bg-white hover:bg-gray-50'}`}>
        {selectMode && (
          <Checkbox checked={selected} onCheckedChange={onToggleSelect} />
        )}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer" onClick={() => onView(file)}>
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{file.folder} • {formatFileSize(file.size)} • {formatDate(file.createdAt)}</p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onCopyUrl(file.url)}><Copy className="w-4 h-4" /></Button>
          <Button size="sm" variant="ghost" onClick={() => onView(file)}><ExternalLink className="w-4 h-4" /></Button>
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => onDelete(file)}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden group hover:shadow-lg transition-all ${selected ? 'ring-2 ring-[#003B8E]' : ''}`}>
      <div 
        className="aspect-square bg-gray-100 relative cursor-pointer"
        onClick={() => selectMode ? onToggleSelect?.() : onView(file)}
      >
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200">
          <FileImage className="w-12 h-12 text-gray-400" />
        </div>
        
        {selectMode ? (
          <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${selected ? 'bg-[#003B8E] text-white' : 'bg-white/80 border'}`}>
            {selected && <Check className="w-4 h-4" />}
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
        <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)} • {formatDate(file.createdAt)}</p>
        {!selectMode && (
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onCopyUrl(file.url)}>
              <Copy className="w-3 h-3 mr-1" /> Copy
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(file)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MediaCard;

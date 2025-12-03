import React from 'react';
import { X, Image, LayoutGrid, FileType, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface UploadFile {
  file: File;
  preview: string;
  category: string;
  tags: string[];
  name: string;
}

interface MediaFileItemProps {
  file: UploadFile;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updates: Partial<UploadFile>) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  onAddTag: (index: number) => void;
}

const CATEGORIES = [
  { value: 'photo', label: 'Photo', icon: Image },
  { value: 'schema', label: 'Schema/Diagram', icon: LayoutGrid },
  { value: 'icon', label: 'Icon', icon: FileType },
  { value: 'illustration', label: 'Illustration', icon: FileImage },
];

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const MediaFileItem: React.FC<MediaFileItemProps> = ({
  file,
  index,
  onRemove,
  onUpdate,
  tagInput,
  setTagInput,
  onAddTag,
}) => {
  const CategoryIcon = CATEGORIES.find(c => c.value === file.category)?.icon || Image;

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border">
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white border">
        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <Input
              value={file.name}
              onChange={e => onUpdate(index, { name: e.target.value })}
              className="font-medium text-sm h-8 w-64"
              placeholder="File name"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formatSize(file.file.size)} • {file.file.type.split('/')[1]?.toUpperCase()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-3 items-center">
          <Select
            value={file.category}
            onValueChange={value => onUpdate(index, { category: value })}
          >
            <SelectTrigger className="w-40 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  <span className="flex items-center gap-2">
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1 flex items-center gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAddTag(index))}
              placeholder="Add tag..."
              className="h-8 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddTag(index)}
              className="h-8"
            >
              Add
            </Button>
          </div>
        </div>

        {file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {file.tags.map((tag, ti) => (
              <Badge
                key={ti}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-red-100"
                onClick={() => onUpdate(index, { tags: file.tags.filter((_, i) => i !== ti) })}
              >
                {tag} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaFileItem;

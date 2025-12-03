import React from 'react';
import { Image, LayoutGrid, FileType, FileImage, Calendar, HardDrive, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface MediaFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  sizeFilter: string;
  setSizeFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const CATEGORIES = [
  { value: 'all', label: 'All Types', icon: Image },
  { value: 'photo', label: 'Photos', icon: Image },
  { value: 'schema', label: 'Schemas', icon: LayoutGrid },
  { value: 'icon', label: 'Icons', icon: FileType },
  { value: 'illustration', label: 'Illustrations', icon: FileImage },
];

const SIZE_OPTIONS = [
  { value: 'all', label: 'Any Size' },
  { value: 'small', label: 'Small (< 100KB)' },
  { value: 'medium', label: 'Medium (100KB - 1MB)' },
  { value: 'large', label: 'Large (> 1MB)' },
];

const DATE_OPTIONS = [
  { value: 'all', label: 'Any Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'size-asc', label: 'Size (Small to Large)' },
  { value: 'size-desc', label: 'Size (Large to Small)' },
];

const MediaFilters: React.FC<MediaFiltersProps> = ({
  categoryFilter,
  setCategoryFilter,
  sizeFilter,
  setSizeFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  onClearFilters,
  activeFiltersCount,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-[#003B8E]/10 text-[#003B8E]">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4 mr-1" /> Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Type</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 bg-white">
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
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Size</label>
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Date</label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MediaFilters;

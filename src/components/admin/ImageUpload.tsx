import React, { useState, useRef } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  aspectRatio?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  label = 'Image', 
  folder = 'general',
  aspectRatio = 'aspect-video'
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-images').getPublicUrl(filePath);
      onChange(data.publicUrl);
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onChange(urlValue.trim());
      setShowUrlInput(false);
      setUrlValue('');
    }
  };

  const handleRemove = async () => {
    if (value.includes('site-images')) {
      try {
        const path = value.split('site-images/')[1];
        if (path) await supabase.storage.from('site-images').remove([path]);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {value ? (
        <div className="relative group">
          <img src={value} alt="Preview" className={`w-full ${aspectRatio} object-cover rounded-lg border`} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button type="button" onClick={handleRemove} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-[#003B8E] hover:bg-blue-50/30'}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-[#003B8E]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="mt-3 text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-600">Click to upload</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          
          {showUrlInput ? (
            <div className="flex gap-2">
              <input type="url" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 p-2 border rounded-lg text-sm" />
              <button type="button" onClick={handleUrlSubmit} className="px-3 py-2 bg-[#003B8E] text-white rounded-lg text-sm">Add</button>
              <button type="button" onClick={() => setShowUrlInput(false)} className="px-3 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowUrlInput(true)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#003B8E]">
              <LinkIcon className="w-4 h-4" /> Or add from URL
            </button>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default ImageUpload;

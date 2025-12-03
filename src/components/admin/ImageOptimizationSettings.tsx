import React from 'react';
import { Settings, Image, Zap, FileImage } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { OptimizationOptions, IMAGE_SIZES } from '@/lib/imageOptimization';

interface Props {
  options: OptimizationOptions;
  onChange: (options: OptimizationOptions) => void;
}

const ImageOptimizationSettings: React.FC<Props> = ({ options, onChange }) => {
  const update = (key: keyof OptimizationOptions, value: boolean | number) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-[#003B8E] rounded-lg flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-gray-800">Image Optimization</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-blue-600" />
            <div>
              <Label className="font-medium">Generate Thumbnails</Label>
              <p className="text-xs text-gray-500">Create small, medium, large versions</p>
            </div>
          </div>
          <Switch
            checked={options.generateThumbnails}
            onCheckedChange={(v) => update('generateThumbnails', v)}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-green-600" />
            <div>
              <Label className="font-medium">Convert to WebP</Label>
              <p className="text-xs text-gray-500">Modern format, smaller files</p>
            </div>
          </div>
          <Switch
            checked={options.convertToWebP}
            onCheckedChange={(v) => update('convertToWebP', v)}
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
          <div className="flex items-center gap-3">
            <FileImage className="w-5 h-5 text-purple-600" />
            <div>
              <Label className="font-medium">Keep Original</Label>
              <p className="text-xs text-gray-500">Store unmodified original</p>
            </div>
          </div>
          <Switch
            checked={options.preserveOriginal}
            onCheckedChange={(v) => update('preserveOriginal', v)}
          />
        </div>

        <div className="p-3 bg-white rounded-lg">
          <div className="flex justify-between mb-2">
            <Label className="font-medium">Compression Quality</Label>
            <Badge variant="secondary">{Math.round(options.compressionQuality * 100)}%</Badge>
          </div>
          <Slider
            value={[options.compressionQuality * 100]}
            onValueChange={([v]) => update('compressionQuality', v / 100)}
            min={50} max={100} step={5}
            className="mt-2"
          />
        </div>

        {options.generateThumbnails && (
          <div className="p-3 bg-white rounded-lg">
            <Label className="font-medium text-sm mb-2 block">Generated Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {IMAGE_SIZES.map(s => (
                <Badge key={s.name} variant="outline" className="text-xs">
                  {s.name}: {s.maxWidth}x{s.maxHeight}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageOptimizationSettings;

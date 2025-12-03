import { 
  IMAGE_SIZES, 
  OptimizationOptions, 
  OptimizedResult, 
  loadImage, 
  resizeImage, 
  getOutputFormat 
} from './imageOptimization';

export interface ProcessedImage {
  sizeName: string;
  result: OptimizedResult;
  fileName: string;
}

export const processImage = async (
  file: File,
  options: OptimizationOptions
): Promise<ProcessedImage[]> => {
  const img = await loadImage(file);
  const format = getOutputFormat(file.type, options.convertToWebP);
  const ext = format.split('/')[1];
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const results: ProcessedImage[] = [];

  // Process original with compression
  if (options.preserveOriginal) {
    const original = await resizeImage(
      img, img.width, img.height, options.compressionQuality, format
    );
    results.push({
      sizeName: 'original',
      result: original,
      fileName: `${baseName}-original.${ext}`,
    });
  }

  // Generate thumbnails
  if (options.generateThumbnails) {
    for (const size of IMAGE_SIZES) {
      const resized = await resizeImage(
        img, size.maxWidth, size.maxHeight, size.quality, format
      );
      results.push({
        sizeName: size.name,
        result: resized,
        fileName: `${baseName}-${size.name}.${ext}`,
      });
    }
  }

  URL.revokeObjectURL(img.src);
  return results;
};

export const generateSingleSize = async (
  file: File,
  sizeName: string,
  options: OptimizationOptions
): Promise<ProcessedImage | null> => {
  const size = IMAGE_SIZES.find(s => s.name === sizeName);
  if (!size) return null;
  
  const img = await loadImage(file);
  const format = getOutputFormat(file.type, options.convertToWebP);
  const ext = format.split('/')[1];
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  
  const result = await resizeImage(
    img, size.maxWidth, size.maxHeight, size.quality, format
  );
  
  URL.revokeObjectURL(img.src);
  
  return {
    sizeName: size.name,
    result,
    fileName: `${baseName}-${size.name}.${ext}`,
  };
};

export const getImageDimensions = async (
  file: File
): Promise<{ width: number; height: number }> => {
  const img = await loadImage(file);
  const dims = { width: img.width, height: img.height };
  URL.revokeObjectURL(img.src);
  return dims;
};

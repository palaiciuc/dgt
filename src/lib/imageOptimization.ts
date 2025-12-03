export interface ImageSize {
  name: 'original' | 'large' | 'medium' | 'small' | 'thumbnail';
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

export const IMAGE_SIZES: ImageSize[] = [
  { name: 'large', maxWidth: 1920, maxHeight: 1080, quality: 0.85 },
  { name: 'medium', maxWidth: 1024, maxHeight: 768, quality: 0.8 },
  { name: 'small', maxWidth: 640, maxHeight: 480, quality: 0.75 },
  { name: 'thumbnail', maxWidth: 200, maxHeight: 200, quality: 0.7 },
];

export interface OptimizationOptions {
  generateThumbnails: boolean;
  convertToWebP: boolean;
  compressionQuality: number;
  preserveOriginal: boolean;
}

export const DEFAULT_OPTIONS: OptimizationOptions = {
  generateThumbnails: true,
  convertToWebP: true,
  compressionQuality: 0.8,
  preserveOriginal: true,
};

export interface OptimizedResult {
  blob: Blob;
  width: number;
  height: number;
  size: string;
  format: string;
}

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const resizeImage = async (
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
  quality: number,
  format: 'image/webp' | 'image/jpeg' | 'image/png'
): Promise<OptimizedResult> => {
  const canvas = document.createElement('canvas');
  let { width, height } = img;
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob: blob!,
        width,
        height,
        size: formatBytes(blob!.size),
        format: format.split('/')[1],
      });
    }, format, quality);
  });
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getOutputFormat = (
  originalType: string,
  convertToWebP: boolean
): 'image/webp' | 'image/jpeg' | 'image/png' => {
  if (convertToWebP) return 'image/webp';
  if (originalType === 'image/png') return 'image/png';
  return 'image/jpeg';
};

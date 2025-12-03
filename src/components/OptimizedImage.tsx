import React, { useState, useEffect } from 'react';
import { getCacheConfig } from '@/lib/cdnCache';

type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

interface OptimizedImageProps {
  basePath: string;
  alt: string;
  size?: ImageSize;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const SIZE_WIDTHS: Record<ImageSize, number> = {
  thumbnail: 200,
  small: 640,
  medium: 1024,
  large: 1920,
  original: 9999,
};

const getOptimizedUrl = (basePath: string, size: ImageSize): string => {
  const base = basePath.replace(/\.[^/.]+$/, '');
  return `${base}-${size}.webp`;
};

const getSrcSet = (basePath: string): string => {
  const sizes: ImageSize[] = ['small', 'medium', 'large'];
  return sizes.map(s => `${getOptimizedUrl(basePath, s)} ${SIZE_WIDTHS[s]}w`).join(', ');
};

const getCacheHeaders = (): string => {
  const config = getCacheConfig();
  let header = `${config.cacheControl}, max-age=${config.maxAge}`;
  if (config.staleWhileRevalidate) header += `, stale-while-revalidate=${Math.floor(config.maxAge / 2)}`;
  if (config.immutable) header += ', immutable';
  return header;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  basePath,
  alt,
  size = 'medium',
  className = '',
  fallbackSrc,
  loading = 'lazy',
  priority = false,
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [cacheHeader, setCacheHeader] = useState('');

  useEffect(() => {
    setCacheHeader(getCacheHeaders());
  }, []);

  const primarySrc = getOptimizedUrl(basePath, size);
  const srcSet = getSrcSet(basePath);

  // Preload priority images
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = primarySrc;
      link.type = 'image/webp';
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    }
  }, [priority, primarySrc]);

  if (error && fallbackSrc) {
    return <img src={fallbackSrc} alt={alt} className={className} loading={loading} />;
  }

  return (
    <picture>
      <source 
        srcSet={srcSet} 
        type="image/webp" 
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px" 
      />
      <img
        src={primarySrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${!loaded ? 'opacity-0 bg-gray-100' : 'opacity-100'}`}
        loading={priority ? 'eager' : loading}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        data-cache-control={cacheHeader}
      />
    </picture>
  );
};

export default OptimizedImage;

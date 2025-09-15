import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loadingPlaceholder?: React.ReactNode;
  sizes?: string;
  priority?: boolean;
  category?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  loadingPlaceholder,
  sizes = '100vw',
  priority = false,
  category
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate category-based fallback
  const getCategoryFallback = (category?: string): string => {
    const fallbacks: Record<string, string> = {
      'Electronics': '/images/fallbacks/electronics.svg',
      'Clothing': '/images/fallbacks/clothing.svg',
      'Home': '/images/fallbacks/home.svg',
      'Garden': '/images/fallbacks/garden.svg',
      'Sports': '/images/fallbacks/sports.svg',
      'Books': '/images/fallbacks/books.svg',
      'Beauty': '/images/fallbacks/beauty.svg',
      'Toys': '/images/fallbacks/toys.svg',
      'Food': '/images/fallbacks/food.svg',
      'Automotive': '/images/fallbacks/automotive.svg'
    };
    
    return fallbacks[category || ''] || '/images/fallbacks/default.svg';
  };

  // Generate WebP and responsive sources
  const generateSources = (originalSrc: string) => {
    if (!originalSrc) return { webp: '', original: '' };
    
    // Extract filename and extension
    const lastDotIndex = originalSrc.lastIndexOf('.');
    const baseName = originalSrc.substring(0, lastDotIndex);
    const extension = originalSrc.substring(lastDotIndex);
    
    return {
      webp: `${baseName}.webp`,
      original: originalSrc,
      // Generate responsive sizes
      small: `${baseName}_400${extension}`,
      medium: `${baseName}_800${extension}`,
      large: `${baseName}_1200${extension}`
    };
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Set image source when in view
  useEffect(() => {
    if (isInView && !currentSrc) {
      setCurrentSrc(src);
    }
  }, [isInView, src, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    const fallback = fallbackSrc || getCategoryFallback(category);
    setCurrentSrc(fallback);
  };

  const sources = generateSources(currentSrc);

  // Loading placeholder
  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        aria-label={`Loading ${alt}`}
      >
        {loadingPlaceholder || (
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          {loadingPlaceholder || (
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
      
      <picture>
        {/* WebP source with responsive sizes */}
        {!hasError && sources.webp && (
          <source
            type="image/webp"
            srcSet={`
              ${sources.webp.replace('.webp', '_400.webp')} 400w,
              ${sources.webp.replace('.webp', '_800.webp')} 800w,
              ${sources.webp.replace('.webp', '_1200.webp')} 1200w
            `}
            sizes={sizes}
          />
        )}
        
        {/* Original format with responsive sizes */}
        <source
          srcSet={`
            ${sources.small} 400w,
            ${sources.medium} 800w,
            ${sources.large} 1200w
          `}
          sizes={sizes}
        />
        
        {/* Fallback image */}
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">Imagen no disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

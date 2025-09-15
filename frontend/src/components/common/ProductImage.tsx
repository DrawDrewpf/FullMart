import React, { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  priority?: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category,
  className = '',
  priority = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback images based on category
  const getFallbackImage = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'electronics':
        return '/images/fallbacks/electronics.svg';
      case 'clothing':
        return '/images/fallbacks/clothing.svg';
      default:
        return '/images/fallbacks/default.svg';
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const imageSrc = hasError ? getFallbackImage(category) : src;

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

export default ProductImage;

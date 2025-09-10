import React, { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  category?: string;
  size?: 'small' | 'medium' | 'large';
}

// URLs de ejemplo funcionales para cada categoría
const getPlaceholderImageByCat = (category: string): string => {
  const cat = category.toLowerCase();
  
  // Usando picsum.photos que funciona mejor que unsplash para placeholders
  switch (cat) {
    case 'electronics':
      return 'https://picsum.photos/400/300?random=1';
    case 'clothing':
      return 'https://picsum.photos/400/300?random=2';
    case 'home':
      return 'https://picsum.photos/400/300?random=3';
    case 'sports':
      return 'https://picsum.photos/400/300?random=4';
    case 'books':
      return 'https://picsum.photos/400/300?random=5';
    default:
      return 'https://picsum.photos/400/300?random=6';
  }
};

const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackText = "Imagen no disponible actualmente",
  category = "general",
  size = "medium"
}) => {
  const [hasError, setHasError] = useState(false);
  const [imageToShow, setImageToShow] = useState<string>(src || '');

  const handleError = () => {
    console.log('Image failed to load:', src);
    setHasError(true);
    // Intentar con una imagen placeholder funcional
    const placeholderImg = getPlaceholderImageByCat(category);
    setImageToShow(placeholderImg);
  };

  const handleLoad = () => {
    setHasError(false);
  };

  // Si no hay src inicial, usar placeholder inmediatamente
  React.useEffect(() => {
    if (!src) {
      const placeholderImg = getPlaceholderImageByCat(category);
      setImageToShow(placeholderImg);
    } else {
      setImageToShow(src);
    }
  }, [src, category]);

  // Iconos SVG más profesionales por categoría
  const getCategoryIcon = (cat: string) => {
    const iconSize = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-10 h-10' : 'w-8 h-8';
    
    switch (cat.toLowerCase()) {
      case 'electronics':
        return (
          <svg className={`${iconSize} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'clothing':
        return (
          <svg className={`${iconSize} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'home':
        return (
          <svg className={`${iconSize} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconSize} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  if (!imageToShow || (hasError && !imageToShow.includes('picsum'))) {
    const textSize = size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs';
    const padding = size === 'small' ? 'p-2' : 'p-6';
    const spacing = size === 'small' ? 'mb-1' : 'mb-3';
    
    return (
      <div className={`w-full h-full bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center ${padding}`}>
        <div className={spacing}>
          {getCategoryIcon(category)}
        </div>
        <span className={`text-center ${textSize} text-gray-500 font-medium leading-tight max-w-20`}>
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageToShow}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};

export default ProductImage;

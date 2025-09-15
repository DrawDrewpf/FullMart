import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { useAppSelector } from '../../hooks/redux';
import type { AppDispatch } from '../../store/store';
import type { Product } from '../../types';
import ProductImage from './ProductImage';
import { formatPrice } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
  className?: string;
  priority?: boolean; // Para lazy loading
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  size = 'medium',
  showDescription = true,
  className = '',
  priority = false
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación cuando se hace clic en el botón
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    
    dispatch(addToCartAsync({
      productId: product.id,
      quantity: 1
    }));
    alert(`${product.name} agregado al carrito`);
  };

  // Estilos dinámicos basados en el tamaño
  const getCardStyles = () => {
    switch (size) {
      case 'small':
        return {
          card: 'bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200',
          image: 'w-full h-32 object-cover',
          padding: 'p-3',
          title: 'text-sm font-medium text-gray-900 mb-1 hover:text-orange-600 transition-colors line-clamp-2',
          description: 'text-gray-600 text-xs mb-2 line-clamp-1',
          price: 'text-lg font-bold text-gray-900',
          button: 'bg-orange-600 hover:bg-orange-700 text-white font-medium py-1 px-2 rounded text-xs',
          badge: 'text-xs px-1.5 py-0.5',
          stock: 'text-xs'
        };
      case 'large':
        return {
          card: 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200',
          image: 'w-full h-64 object-cover',
          padding: 'p-6',
          title: 'text-xl font-semibold text-gray-900 mb-3 hover:text-orange-600 transition-colors line-clamp-2',
          description: 'text-gray-600 text-base mb-4 line-clamp-3',
          price: 'text-3xl font-bold text-gray-900',
          button: 'bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-md text-base',
          badge: 'text-sm px-3 py-1',
          stock: 'text-sm'
        };
      default: // medium
        return {
          card: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200',
          image: 'w-full h-48 object-cover',
          padding: 'p-4',
          title: 'text-lg font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors line-clamp-2',
          description: 'text-gray-600 text-sm mb-3 line-clamp-2',
          price: 'text-2xl font-bold text-gray-900',
          button: 'bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm',
          badge: 'text-xs px-2 py-1',
          stock: 'text-xs'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div className={`${styles.card} ${className}`}>
      <Link to={`/product/${product.id}`}>
        <ProductImage
          src={product.image_url}
          alt={product.name}
          category={product.category}
          className={styles.image}
          priority={priority}
        />
      </Link>
      
      <div className={styles.padding}>
        {/* Category Badge */}
        <div className="mb-2">
          <span className={`inline-block bg-gray-100 text-gray-800 rounded-full capitalize ${styles.badge}`}>
            {product.category}
          </span>
        </div>
        
        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className={styles.title}>
            {product.name}
          </h3>
        </Link>
        
        {/* Description */}
        {showDescription && product.description && (
          <p className={styles.description}>
            {product.description}
          </p>
        )}
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <span className={styles.price}>
            {formatPrice(product.price)}
          </span>
          
          {product.stock_quantity > 0 ? (
            <button
              onClick={handleAddToCart}
              className={styles.button}
            >
              Agregar
            </button>
          ) : (
            <span className="text-red-600 font-medium">
              Agotado
            </span>
          )}
        </div>
        
        {/* Stock Warning */}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <p className={`text-orange-600 mt-2 ${styles.stock}`}>
            ¡Solo quedan {product.stock_quantity}!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

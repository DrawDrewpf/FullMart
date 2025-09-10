import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../store/slices/cartSlice';
import { fetchProductById } from '../store/slices/productsSlice';
import type { AppDispatch } from '../store/store';
import { useAppSelector } from '../hooks/redux';
import ProductImage from '../components/common/ProductImage';
import { formatPrice, formatCartTotal } from '../utils/currency';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { products, selectedProduct } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Intentar encontrar el producto en el estado primero, luego en selectedProduct
  const product = products.find(p => p.id === Number(id)) || selectedProduct;

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      
      // Si no tenemos el producto, lo buscamos
      if (!product) {
        dispatch(fetchProductById(Number(id)))
          .unwrap()
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [id, dispatch, product]);

  // Mostrar loading
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center py-16">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar producto</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link 
          to="/products"
          className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  // Si no existe el producto después de cargar, mostrar mensaje
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
        <p className="text-gray-600 mb-6">El producto que buscas no existe o no está disponible.</p>
        <Link 
          to="/products"
          className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
        >
          Ver todos los productos
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    
    dispatch(addToCartAsync({ productId: product.id, quantity }));
    // Mostrar notificación (más adelante implementaremos toast)
    alert(`${quantity} x ${product.name} agregado al carrito`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-orange-600">Inicio</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-orange-600">Productos</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <ProductImage 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              fallbackText="Imagen no disponible actualmente"
              category={product.category}
              size="large"
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {product.category}
              </span>
              <span className="text-sm text-gray-500">
                Stock: {product.stock_quantity} disponibles
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          </div>

          {/* Precio */}
          <div className="border-t border-b py-4">
            <span className="text-4xl font-bold text-orange-600">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Controles de cantidad y agregar al carrito */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {product.stock_quantity === 0 ? 'Sin Stock' : `Agregar al Carrito - ${formatCartTotal(Number(product.price) * quantity)}`}
              </button>
              
              <Link 
                to="/products"
                className="block w-full text-center bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

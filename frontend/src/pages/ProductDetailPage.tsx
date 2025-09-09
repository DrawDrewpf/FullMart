import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../store/slices/cartSlice';
import { fetchProductById } from '../store/slices/productsSlice';
import type { AppDispatch } from '../store/store';
import { useAppSelector } from '../hooks/redux';
import ProductImage from '../components/common/ProductImage';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);

  const { products } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const product = products.find(p => p.id === Number(id));

  useEffect(() => {
    if (id && !product) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [id, product, dispatch]);

  // Si no existe el producto, redirigir a productos
  if (!product) {
    return <Navigate to="/products" replace />;
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
              {product.price} €
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
                {product.stock_quantity === 0 ? 'Sin Stock' : `Agregar al Carrito - ${((Number(product.price) * quantity).toFixed(2))} €`}
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
